

class Website {
    website = "";
    name = "";
    novels = [];
    constructor(website,name) {
        this.website=website;
        this.name=name;
    }
    constructor(website,name,novels) {
        this.website=website;
        this.name=name;
        this.novels = novels;
    }
}