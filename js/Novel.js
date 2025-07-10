
class Novel {
    
    name = "";
    lastChapter = "";
    lastChapter2 = "";
    path = []
    constructor(name,  path,lastChapter) {
        
        this.name = name;
        
        this.lastChapter = lastChapter;
        this.path = path;
        console.log("constructed with this path: " + this.path)
    }
    update(lastChapter) {
        this.lastChapter2 = this.lastChapter;
        this.lastChapter = lastChapter;
    }
    toJSON() {
        return {
        name: this.name,
        lastChapter: this.lastChapter,
        lastChapter2: this.lastChapter2,
        path:this.path
        };
    }

  

    static fromJSON(obj) {
        const novel = new Novel(obj.name,obj.path, obj.lastChapter);
        novel.lastChapter2 = obj.lastChapter2;
        return novel;
    }
}