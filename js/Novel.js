
class Novel {
    
    name = "";
    lastChapter = "";
    lastChapter2 = "";
    path = []
    recentTimestamp = 0;
    constructor(name,  path,lastChapter,timestamp) {
        
        this.name = name;
        this.recentTimestamp = timestamp;
        this.lastChapter = lastChapter;
        this.path = path;
        console.log("constructed with this path: " + this.path)
    }
    update(lastChapter,timestamp) {
        this.lastChapter2 = this.lastChapter;
        this.lastChapter = lastChapter;
        this.recentTimestamp = timestamp;
    }
    toJSON() {
        return {
        name: this.name,
        lastChapter: this.lastChapter,
        lastChapter2: this.lastChapter2,
        path:this.path,
        recentTimestamp: this.recentTimestamp
        };
    }

  

    static fromJSON(obj) {
        const novel = new Novel(obj.name,obj.path, obj.lastChapter,obj.recentTimestamp);
        novel.lastChapter2 = obj.lastChapter2;
        return novel;
    }
}