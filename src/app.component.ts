import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

import { GithubService } from './services/github.service';
import { CommitParserService } from './services/commit-parser.service';
import { FilterBarComponent, Filters } from './components/filter-bar/filter-bar.component';
import { CommitListComponent } from './components/commit-list/commit-list.component';
import { ParsedCommit } from './models/commit.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    FilterBarComponent,
    CommitListComponent,
  ],
})
export class AppComponent {
  private githubService = inject(GithubService);
  private commitParser = inject(CommitParserService);

  // --- State Signals ---
  ghToken = signal<string>('');
  repoPath = signal<string>(''); 
  allCommits = signal<ParsedCommit[]>([]);
  filters = signal<Filters>({
    text: '',
    author: 'all',
    type: 'all',
    scope: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'date-desc'
  });
  userRepos = signal<{full_name: string}[]>([]);

  isLoading = signal(false);
  errorMsg = signal<string | null>(null);
  hasConnected = signal(false);

  // --- Computed Signals for filtering and data derivation ---
  uniqueTypes = computed(() => this.getUniqueValues(this.allCommits(), 'type'));
  uniqueScopes = computed(() => this.getUniqueValues(this.allCommits(), 'scope'));
  uniqueAuthors = computed(() => this.getUniqueValues(this.allCommits(), 'author'));
  
  filteredCommits = computed(() => {
    const commits = this.allCommits();
    const f = this.filters();
    let result = [...commits];

    if (f.text) {
      const lowerText = f.text.toLowerCase();
      result = result.filter(c => 
        c.subject.toLowerCase().includes(lowerText) ||
        c.author.toLowerCase().includes(lowerText) ||
        c.hash.toLowerCase().startsWith(lowerText)
      );
    }

    if (f.author !== 'all') result = result.filter(c => c.author === f.author);
    if (f.type !== 'all') result = result.filter(c => c.type === f.type);
    if (f.scope !== 'all') result = result.filter(c => c.scope === f.scope);

    if (f.startDate) {
        const start = new Date(f.startDate).getTime();
        result = result.filter(c => c.date.getTime() >= start);
    }
    if (f.endDate) {
        const end = new Date(f.endDate).getTime();
        result = result.filter(c => c.date.getTime() <= end);
    }

    switch (f.sortBy) {
        case 'date-asc':
            result.sort((a, b) => a.date.getTime() - b.date.getTime());
            break;
        case 'author-asc':
            result.sort((a, b) => a.author.localeCompare(b.author));
            break;
        case 'type-asc':
            result.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
            break;
        default: // date-desc
            result.sort((a, b) => b.date.getTime() - a.date.getTime());
            break;
    }

    return result;
  });

  commitStats = computed(() => {
    const commits = this.allCommits();
    const uniqueAuthors = new Set(commits.map(c => c.author));
    const typesMap = new Map<string, number>();
    
    commits.forEach(commit => {
      if (commit.type) {
        typesMap.set(commit.type, (typesMap.get(commit.type) || 0) + 1);
      }
    });

    const distribution = Array.from(typesMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    return {
      commitsDisplayed: this.filteredCommits().length,
      commitsTotal: commits.length,
      authors: uniqueAuthors.size,
      types: typesMap.size,
      distribution: distribution,
      maxCount: Math.max(...distribution.map(d => d.count), 1), // Avoid division by zero
    };
  });


  async connectToRepo(): Promise<void> {
    if (!this.repoPath() || !this.repoPath().includes('/')) {
      this.errorMsg.set('Formato do repositório inválido. Use "dono/repo".');
      return;
    }
    
    this.isLoading.set(true);
    this.errorMsg.set(null);
    this.hasConnected.set(true);

    try {
      const [owner, repo] = this.repoPath().split('/');
      const rawCommits = await this.githubService.getCommits(owner, repo, this.ghToken());
      
      const parsed = rawCommits.map(commit => {
        const parsedMessage = this.commitParser.parse(commit.commit.message);
        return {
          hash: commit.sha.substring(0, 7),
          author: commit.commit.author.name,
          date: new Date(commit.commit.author.date),
          message: commit.commit.message,
          html_url: commit.html_url,
          ...parsedMessage
        };
      });

      this.allCommits.set(parsed);
    } catch (error) {
      console.error(error);
      this.errorMsg.set('Falha ao buscar commits. Verifique o token, o nome do repositório e as permissões.');
      this.allCommits.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  onFiltersChanged(newFilters: Filters): void {
    this.filters.set(newFilters);
  }

  private getUniqueValues(commits: ParsedCommit[], property: keyof ParsedCommit): string[] {
    const values = commits
      .map(c => c[property])
      .filter((value): value is string => typeof value === 'string' && value.trim() !== '');
    return [...new Set(values)].sort();
  }

  async onTokenChange(token: string) {
    this.ghToken.set(token);
    this.errorMsg.set(null);

    if (token) {
        try {
            const repos = await this.githubService.getUserRepos(token);
            this.userRepos.set(repos);
            if (repos.length > 0) {
              this.repoPath.set(repos[0].full_name);
            }
        } catch (e) {
            console.error("Failed to fetch user repos", e);
            this.userRepos.set([]);
            this.errorMsg.set('Falha ao buscar repositórios. O PAT é inválido ou não tem permissão.');
        }
    } else {
        this.userRepos.set([]);
    }
  }

  getTypeStyling(type: string | null): { icon: string; color: string; text: string, barColor: string } {
    switch (type) {
      case 'feat': return { text: 'Funcionalidade', icon: 'M12 4.5v15m7.5-7.5h-15', color: 'text-green-600', barColor: 'bg-green-500'};
      case 'fix': return { text: 'Correção', icon: 'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z', color: 'text-red-600', barColor: 'bg-red-500'};
      case 'docs': return { text: 'Documentação', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25', color: 'text-purple-600', barColor: 'bg-purple-500' };
      case 'refactor': return { text: 'Refatoração', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.695v4.992h-4.992m0 0l-3.181-3.183a8.25 8.25 0 0111.667 0l3.181 3.183', color: 'text-cyan-600', barColor: 'bg-cyan-500'};
      default: return { text: type || 'Outros', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 13.5A2.25 2.25 0 016 11.25h2.25a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 018.25 18H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 13.5a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z', color: 'text-gray-600', barColor: 'bg-gray-400' };
    }
  }
}