import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GithubCommit } from '../models/commit.model';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.github.com';

  getCommits(owner: string, repo: string, token: string): Promise<GithubCommit[]> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/commits?per_page=100`;
    let headers = new HttpHeaders({
      'Accept': 'application/vnd.github.v3+json',
    });

    if (token) {
      headers = headers.set('Authorization', `token ${token}`);
    }

    return firstValueFrom(this.http.get<GithubCommit[]>(url, { headers }));
  }

  getUserRepos(token: string): Promise<{full_name: string}[]> {
    const url = `${this.apiUrl}/user/repos?per_page=100&sort=updated&type=all`;
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`
    });
    return firstValueFrom(this.http.get<{full_name: string}[]>(url, { headers }));
  }
}