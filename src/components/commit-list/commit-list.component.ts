import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ParsedCommit } from '../../models/commit.model';
import { EmojiPipe } from '../../pipes/emoji.pipe';

@Component({
  selector: 'app-commit-list',
  standalone: true,
  imports: [CommonModule, DatePipe, EmojiPipe],
  templateUrl: './commit-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommitListComponent {
  commits = input.required<ParsedCommit[]>();

  getTypeDetails(type: string | null): { icon: string; color: string; text: string } {
    switch (type) {
      case 'feat': return { text: 'Funcionalidade', icon: 'M12 4.5v15m7.5-7.5h-15', color: 'text-green-700 bg-green-100' };
      case 'fix': return { text: 'Correção', icon: 'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z', color: 'text-red-700 bg-red-100' };
      case 'docs': return { text: 'Documentação', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25', color: 'text-purple-700 bg-purple-100' };
      case 'refactor': return { text: 'Refatoração', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.695v4.992h-4.992m0 0l-3.181-3.183a8.25 8.25 0 0111.667 0l3.181 3.183', color: 'text-cyan-700 bg-cyan-100'};
      case 'style': return { text: 'Estilo', icon: 'M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 0 .5 22.122a3 3 0 0 0 5.78-1.128 2.25 2.25 0 0 1 2.475-2.118 2.25 2.25 0 0 0-2.225-1.754h-.008ZM15.53 5.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 0 4.5 10.122a3 3 0 0 0 5.78-1.128 2.25 2.25 0 0 1 2.475-2.118 2.25 2.25 0 0 0-2.225-1.754h-.008Z', color: 'text-pink-700 bg-pink-100' };
      case 'perf': return { text: 'Performance', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', color: 'text-yellow-700 bg-yellow-100' };
      case 'test': return { text: 'Testes', icon: 'M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75', color: 'text-lime-700 bg-lime-100' };
      case 'chore': return { text: 'Chore', icon: 'M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.868-1.455L17.578 12m-6.478 3.488L2.25 9m8.868 1.455L17.578 12m0 0l2.172-1.161m-2.172 1.161L12 14.25m2.172-3.089L12 11.161m0 0L9.828 12m2.172-3.089L12 8.072M9.828 12l-2.172-1.161M14.172 12l-2.172 1.161M12 11.161V8.072M12 14.25v-3.089', color: 'text-gray-600 bg-gray-100' };
      default: return { text: type || 'Misc', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 13.5A2.25 2.25 0 016 11.25h2.25a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 018.25 18H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 13.5a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z', color: 'text-gray-600 bg-gray-100' };
    }
  }
}