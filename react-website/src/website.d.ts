declare module '@js/Website.js' {
  import { Novel } from '@js/Novel.js';

  export class Website {
    domain: string;
    novel: number;
    chapter: number;
    novels: Novel[];
    generic: Novel;

    constructor(domain?: string);
    getDomain(): string;
    updateNovel(tokens: string[]): void;
    updateWebsiteURL(pathLength: number): void;
    toJSON(): object;
    static fromJSON(obj: any): Website;
  }
}