

class BaseParser {
    novel = 1;
    chapter = 2;
    constructor(url,novel,chapter) {
        this.url = url;

        /** @type {string[]} */
        this.tokens = new URL(url).pathname.split("/").filter(Boolean);
        this.novel=novel;
        this.chapter=chapter;
    }

    getNovel() {
        if (this.tokens.size()<=this.novel) {
            return "";
        }
        return this.tokens[this.novel];
    }

    getChapter() {
        if (this.tokens.size()<=this.chapter) {
            return this.chapter;
        }
        return this.tokens[this.chapter];
    }

    printTokens() {
        console.log(this.tokens);
    }
}