// @ts-nocheck

class BaseParser {
    constructor(url,novel,chapter) {
        this.url = url;
        this.tokens = new URL(url).pathname.split("/").filter(Boolean);
        this.novel=novel;
        this.chapter=chapter;
    }

    getNovel() {
        return null;
    }

    getChapter() {
        return null;
    }

    printTokens() {
        console.log(this.tokens);
    }
}