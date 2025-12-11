export interface GithubAuthor {
  name: string;
  email: string;
  date: string;
}

export interface GithubCommitDetails {
  author: GithubAuthor;
  message: string;
}

export interface GithubCommit {
  sha: string;
  commit: GithubCommitDetails;
  html_url: string;
}

export interface ParsedCommit {
  hash: string;
  author: string;
  date: Date;
  message: string;
  html_url: string;
  type: string | null;
  scope: string | null;
  subject: string;
  body: string | null;
  isBreaking: boolean;
}
