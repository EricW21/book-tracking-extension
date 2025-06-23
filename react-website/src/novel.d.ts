declare module '@js/Novel.js' {
  export class Novel {
    name: string;
    lastChapter: string;
    lastChapter2: string;
    constructor(name: string, lastChapter: string);
    update(lastChapter: string): void;
    toJSON(): object;
    static fromJSON(obj: any): Novel;
  }
}