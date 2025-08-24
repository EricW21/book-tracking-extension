

class Website {
    domain = "";
    novelIndex = 1;
    chapterIndex = 2;
    novels = [];
    
    
    // gonna enforce an unchanging novelIndex and chapterIndex
    constructor(domain="",novelIndex,chapterIndex) {

        if (novelIndex==undefined || chapterIndex==undefined) {
            throw Error("at least one of the indexes are undefined");
        }
        this.domain = domain;
        this.novelIndex = novelIndex;
        this.chapterIndex = chapterIndex;
        
    }

    getDomain() {
        return this.domain;
    }

    updateNovel(tokens,timestamp) {
        console.log("website recieves tokens:"+ tokens);
        
        
        
        

        
        if (tokens.length >= this.chapterIndex+1 ) {
            let found = false;
            for (let i = 0; i < this.novels.length; i++) {
                if (this.novels[i].name === tokens[this.novelIndex]) {
                    console.log("website sends tokens:"+ tokens);
                    this.novels[i].update(tokens,timestamp);
                    // Move the found novel to the first position for faster future access
                    if (i > 0) {
                        const [removed] = this.novels.splice(i, 1);
                        this.novels.unshift(removed);
                    }
                    found = true;
                    break;
                }
            }   
            if (!found) {
                const path = tokens.slice(0,tokens.length-1);
                console.log(path + " novel adding");
                const newNovel = new Novel(tokens[this.novelIndex],path,tokens[tokens.length-1],timestamp,this.domain);
                this.novels.unshift(newNovel);
            }
        }
    }
        
        
    
    
    toJSON() {
        return {
            domain: this.domain,
            novelIndex: this.novelIndex,
            chapterIndex: this.chapterIndex,
            novels: this.novels.map(n => n.toJSON?.() || n)
            
        };
    }

    

    addWebsite(website) {
        // combines websites
        // whichever novel instance takes priority depends on the timestamp
        let thisWebsitesNovels = new Map();

        for (let i=0;i<this.novels.length;i++) {
            const novel = this.novels[i];
            thisWebsitesNovels.set(novel.name,i);
        }

        for (let i=0;i<website.novels.length;i++) {
            const novel = website.novels[i];
            if (thisWebsitesNovels.has(novel.name)) {
                const index = thisWebsitesNovels.get(novel.name);
                
                const n1 = this.novels[index];
                const n2 = novel;
                // the most recent novel should be set to the novel being called on
                this.novels[index] = (n1.recentTimestamp < n2.recentTimestamp) ? n2 : n1;
                
            }
            else {
                this.novels.push(novel);
            }
        }
    }

    
    static fromJSON(obj) {
        if (!obj || typeof obj.novelIndex === "undefined" || typeof obj.chapterIndex === "undefined") {
            throw new Error("Invalid Website object: missing novelIndex or chapterIndex");
        }
        if (!obj) {
            throw new Error("Cannot create Website from undefined object");
        }
        const website = new Website(obj.domain,obj.novelIndex,obj.chapterIndex);
        
        
        website.novels = Array.isArray(obj.novels)
            ? obj.novels.map(n => Novel.fromJSON?.(n) || n)
            : [];
        return website;
    }
    
    
}


module.exports = { Website };
