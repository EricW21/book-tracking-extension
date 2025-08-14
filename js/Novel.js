
class Novel {
    
    name = "";
    lastChapter = "";
    
    path = []
    recentTimestamp = 0;
    domain = "";
    constructor(name,  path,lastChapter,timestamp,domain) {
        
        this.name = name;
        this.recentTimestamp = timestamp;
        this.lastChapter = lastChapter;
        this.path = path;
        this.domain = domain;
        
    }
    update(tokens,timestamp) {
        
        this.lastChapter = tokens[tokens.length-1];

        console.log("update chapter" + this.lastChapter);
        this.path = tokens.slice(0, -1);
        this.recentTimestamp = timestamp;
    }

    recoverPath(chapter) {
        const url = "https://" + this.domain + "/" + this.path.join('/') +"/"+ chapter;
        return url;
    }

    toJSON() {
        return {
        name: this.name,
        lastChapter: this.lastChapter,
        
        path:this.path,
        recentTimestamp: this.recentTimestamp,
        domain: this.domain
        };
    }

    

  

    static fromJSON(obj) {
        
        const novel = new Novel(obj.name,obj.path, obj.lastChapter,obj.recentTimestamp,obj.domain);
        
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