import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CommitParserService {
  // Regex to parse conventional commits: type(scope?): subject
  private conventionalCommitRegex = /^(\w*)(?:\(([\w\s\.\-\*\/]*)\))?(!?):\s(.*)$/;
  // Fallback for messages that don't match
  private simpleCommitRegex = /^(.*)$/;

  parse(message: string): { type: string | null; scope: string | null; isBreaking: boolean, subject: string, body: string | null } {
    const lines = message.split('\n');
    const firstLine = lines[0];
    const body = lines.slice(1).join('\n').trim();

    const match = firstLine.match(this.conventionalCommitRegex);
    if (match) {
      const isBreakingFooter = body.toUpperCase().includes('BREAKING CHANGE:');
      return {
        type: match[1] || null,
        scope: match[2] ? match[2].trim() : null,
        isBreaking: match[3] === '!' || isBreakingFooter,
        subject: match[4].trim(),
        body: body || null
      };
    }
    
    // Fallback for non-conventional commits
    const simpleMatch = firstLine.match(this.simpleCommitRegex);
    return {
      type: null,
      scope: null,
      isBreaking: body.toUpperCase().includes('BREAKING CHANGE:'),
      subject: simpleMatch ? simpleMatch[1].trim() : 'No commit message',
      body: body || null
    };
  }
}
