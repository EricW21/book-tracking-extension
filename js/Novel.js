
class Novel {
    
    name = "";
    lastChapter = "";
    
    path = []
    recentTimestamp = 0;
    constructor(name,  path,lastChapter,timestamp) {
        
        this.name = name;
        this.recentTimestamp = timestamp;
        this.lastChapter = lastChapter;
        this.path = path;
        
    }
    update(lastChapter,timestamp) {
        
        this.lastChapter = lastChapter;
        this.recentTimestamp = timestamp;
    }
    toJSON() {
        return {
        name: this.name,
        lastChapter: this.lastChapter,
        
        path:this.path,
        recentTimestamp: this.recentTimestamp
        };
    }

    

  

    static fromJSON(obj) {
        
        const novel = new Novel(obj.name,obj.path, obj.lastChapter,obj.recentTimestamp);
        
        return novel;
    }
}



async function setWebsite(website) {
    await chrome.storage.local.set({ [website.domain]: website.toJSON() }).then(() => {
        console.log("Website updated:", website.toJSON());
        
    });
}