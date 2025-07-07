
class Novel {
    
    name = "";
    lastChapter = "";
    lastChapter2 = "";
    path = []
    constructor(novelIndex,  tokens) {
        
        this.name = tokens[novelIndex];
        
        this.lastChapter = tokens[tokens.length-1];
        this.path = tokens.slice(0,tokens.length-1);
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