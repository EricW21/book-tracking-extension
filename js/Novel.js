
export class Novel {
    
    name = "";
    lastChapter = "";
    lastChapter2 = "";
    constructor(name,  lastChapter) {
        
        this.name = name;
        
        this.lastChapter = lastChapter;
    }
    update(lastChapter) {
        this.lastChapter2 = this.lastChapter;
        this.lastChapter = lastChapter;
    }
    toJSON() {
        return {
        name: this.name,
        lastChapter: this.lastChapter,
        lastChapter2: this.lastChapter2
        };
    }

    static fromJSON(obj) {
        const novel = new Novel(obj.name, obj.lastChapter);
        novel.lastChapter2 = obj.lastChapter2;
        return novel;
    }
}