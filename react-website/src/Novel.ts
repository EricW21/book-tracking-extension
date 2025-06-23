export class Novel {
  name: string = "";
  lastChapter: string = "";
  lastChapter2: string = "";

  constructor(name: string, lastChapter: string) {
    this.name = name;
    this.lastChapter = lastChapter;
  }

  update(lastChapter: string): void {
    this.lastChapter2 = this.lastChapter;
    this.lastChapter = lastChapter;
  }

  toJSON(): { name: string; lastChapter: string; lastChapter2: string } {
    return {
      name: this.name,
      lastChapter: this.lastChapter,
      lastChapter2: this.lastChapter2,
    };
  }

  static fromJSON(obj: {
    name: string;
    lastChapter: string;
    lastChapter2: string;
  }): Novel {
    const novel = new Novel(obj.name, obj.lastChapter);
    novel.lastChapter2 = obj.lastChapter2;
    return novel;
  }
}
