

class Website {
    domain = "";
    novel = 0;
    chapter = 0;
    novels = [];

    // this is meant to store a generic novel object to account for edge cases
    //  (website has urls that aren't chapters, or chapters aren't a suburl of novels)

    generic = new Novel("","");
    
    
    constructor(domain="") {
        this.domain = domain;
    }

    getDomain() {
        return this.domain;
    }

    updateNovel(tokens) {
        
        // not a new chapter nor a new novel
        if (tokens.length==0) {
            return;
        }
        if (tokens.length < this.novel) {
            return;
        }

        
        this.updateWebsiteURL(tokens.length);
        console.log("novel: " + this.novel + " chapter: " + this.chapter);

        if (this.chapter==this.novel) {
            this.generic.update(tokens[tokens.length-1]);
        }
        else if (tokens.length == this.chapter + 1) {
            let found = false;
            for (let i = 0; i < this.novels.length; i++) {
                if (this.novels[i].name === tokens[this.novel]) {
                    this.novels[i].update(tokens[tokens.length - 1]);
                    // Move the found novel to the first position for faster future access
                    if (i !== 0) {
                        const [found] = this.novels.splice(i, 1);
                        this.novels.unshift(found);
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
        
        
    
    updateWebsiteURL(pathLength) {
        pathLength -=1; // accounts for the fact that a pathlength of 1 means that the zero index contains a value

        // new beginning
        if (this.novel==0 && this.chapter==0) {
            this.novel = pathLength-1;
            if (this.novel<0) {
                this.novel = 0;
            }
            this.chapter = pathLength;
            return;
        }
        // accounts for the case when the url is longer than the current novel and chapter 
        if (pathLength > this.novel) {
            if (pathLength > this.chapter) {
                this.novel = this.chapter;
                this.chapter = pathLength;
            }
            else if (pathLength!=this.chapter) {
                this.novel = pathLength;
            }
        }

        // accounts for the case when the url is shorter than the current novel and chapter but novel==chapter
        if (pathLength < this.novel && this.novel==this.chapter) {
            this.novel = pathLength;
        }
    }
    toJSON() {
        return {
            domain: this.domain,
            novel: this.novel,
            chapter: this.chapter,
            novels: this.novels.map(n => n.toJSON?.() || n),
            generic: this.generic.toJSON?.() || this.generic
        };
    }
    static fromJSON(obj) {
        const website = new Website(obj.domain);
        website.novel = obj.novel;
        website.chapter = obj.chapter;
        website.generic = Novel.fromJSON?.(obj.generic) || obj.generic;
        website.novels = Array.isArray(obj.novels)
            ? obj.novels.map(n => Novel.fromJSON?.(n) || n)
            : [];
        return website;
    }
    
    
}