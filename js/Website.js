

class Website {
    domain = "";
    novelIndex = 1;
    chapterIndex = 2;
    novels = [];

    
    // gonna enforce an unchanging novelIndex and chapterIndex
    constructor(domain="",novelIndex=1,chapterIndex=2) {
        this.domain = domain;
        this.novelIndex = novelIndex;
        this.chapterIndex = chapterIndex;
    }

    getDomain() {
        return this.domain;
    }

    updateNovel(tokens,timestamp) {
        
        
        if (tokens.length==0) {
            return;
        }
        if (tokens.length < this.chapterIndex) {
            return;
        }
        

        
        if (tokens.length >= this.chapterIndex + 1) {
            let found = false;
            for (let i = 0; i < this.novels.length; i++) {
                if (this.novels[i].name === tokens[this.novelIndex]) {
                    this.novels[i].update(tokens[tokens.length - 1],timestamp);
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
                const newNovel = new Novel(tokens[this.novelIndex],path,tokens[tokens.length-1],timestamp);
                this.novels.unshift(newNovel);
            }
        }
    }
        
        
    
    
    toJSON() {
        return {
            domain: this.domain,
            novel: this.novelIndex,
            chapter: this.chapterIndex,
            novels: this.novels.map(n => n.toJSON?.() || n)
            
        };
    }

    recoverPath(novel,chapter) {
        
        
        const url = "https://" + this.domain + "/" + novel.path.join('/') +"/"+ chapter;
        return url;
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
        const website = new Website(obj.domain,obj.novelIndex,obj.chapterIndex);
        website.novelIndex = obj.novel;
        website.chapterIndex = obj.chapter;
        
        website.novels = Array.isArray(obj.novels)
            ? obj.novels.map(n => Novel.fromJSON?.(n) || n)
            : [];
        return website;
    }
    
    
}

