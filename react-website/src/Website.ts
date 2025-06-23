import { Novel } from './Novel'; 

export class Website {
  domain: string = "";
  novel: number = 1;
  chapter: number = 2;
  novels: Novel[] = [];


  generic: Novel = new Novel("", "");

  constructor(domain: string = "") {
    this.domain = domain;
  }

  getDomain(): string {
    return this.domain;
  }

  updateNovel(tokens: string[]): void {
    if (tokens.length === 0) {
      return;
    }
    if (tokens.length < this.novel) {
      return;
    }

    this.updateWebsiteURL(tokens.length);
    console.log("novel: " + this.novel + " chapter: " + this.chapter);

    if (this.chapter === this.novel) {
      this.generic.update(tokens[tokens.length - 1]);
    } else if (tokens.length === this.chapter + 1) {
      let found = false;
      for (let i = 0; i < this.novels.length; i++) {
        if (this.novels[i].name === tokens[this.novel]) {
          this.novels[i].update(tokens[tokens.length - 1]);
          // Move the found novel to the front for faster access
          if (i !== 0) {
            const [foundNovel] = this.novels.splice(i, 1);
            this.novels.unshift(foundNovel);
          }
          found = true;
          break;
        }
      }
      if (!found) {
        const newNovel = new Novel(tokens[this.novel], tokens[tokens.length - 1]);
        this.novels.unshift(newNovel);
      }
    }
  }

  updateWebsiteURL(pathLength: number): void {
    pathLength -= 1; // Because zero-indexed paths

    if (this.novel === 0 && this.chapter === 0) {
      this.novel = pathLength - 1;
      if (this.novel < 0) {
        this.novel = 0;
      }
      this.chapter = pathLength;
      return;
    }

    if (pathLength > this.novel) {
      if (pathLength > this.chapter) {
        this.novel = this.chapter;
        this.chapter = pathLength;
      } else if (pathLength !== this.chapter) {
        this.novel = pathLength;
      }
    }

    if (pathLength < this.novel && this.novel === this.chapter) {
      this.novel = pathLength;
    }
  }

  toJSON(): {
    domain: string;
    novel: number;
    chapter: number;
    novels: ReturnType<Novel["toJSON"]>[];
    generic: ReturnType<Novel["toJSON"]>;
  } {
    return {
      domain: this.domain,
      novel: this.novel,
      chapter: this.chapter,
      novels: this.novels.map(n => n.toJSON()),
      generic: this.generic.toJSON(),
    };
  }

  static fromJSON(obj: {
    domain: string;
    novel: number;
    chapter: number;
    novels: Novel[]; 
    generic: any;
  }): Website {
    const website = new Website(obj.domain);
    website.novel = obj.novel;
    website.chapter = obj.chapter;
    website.generic = Novel.fromJSON(obj.generic);
    website.novels = Array.isArray(obj.novels)
      ? obj.novels.map(n => Novel.fromJSON(n))
      : [];
    return website;
  }
}