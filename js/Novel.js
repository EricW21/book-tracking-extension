
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
    update(tokens,timestamp) {
        
        this.lastChapter = tokens[tokens.length-1];

        console.log("update chapter" + this.lastChapter);
        this.path = tokens.slice(0, -1);
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

/**
 * @param {string} url
 * @returns {string}
 */
function extractWebsite(url) {
    try {
        const hostname = new URL(url).hostname;
        const parts = hostname.split('.');
        if (parts.length >= 2) {
            return parts.slice(-2).join('.');
        }
        return hostname;
    } catch (e) {
        console.error("Not an URL", url);
        return "";
    }
}