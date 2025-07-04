

let trackedWebsites = [];
let websiteTemplate;
let main;
let novelTemplate;

InitializePage()
let lastWebsite = new Website();


async function InitializePage() {
    websiteTemplate = document.getElementById("website-row-template");
    novelTemplate = document.getElementById("novel-row-template");
    const result = await chrome.storage.local.get(["trackedWebsites"]);
    trackedWebsites = new Set(result.trackedWebsites || []);
    main = document.getElementById("info-rows-template");
    await LoadWebsites();
}



async function LoadWebsites() {
    // add the main div
    
    for (const site of trackedWebsites) {
        await LoadSingleWebsite(site);
    }
    
}

async function LoadSingleWebsite(site) {
    
    let parent = websiteTemplate.content.cloneNode(true);
    console.log(site);
    let websiteName = parent.querySelector('.website');
    websiteName.textContent=site;
    container = parent.querySelector('.novels-inside-websites');
    container.removeAttribute('id');
	

    await LoadNovels(container,site);
    main.append(parent);
    
   
    // append the div to the main div

}

async function LoadNovels(parent,site) {
    
    // create novel divs    

    const result = await chrome.storage.local.get([site]);
    let website = Website.fromJSON(result[site]);

    
    for (const novel of website.novels) {
        const node = await LoadSingleNovel(novel);
        parent.append(node);
    }
    
    // append novel divs to the website div
    
}

async function LoadSingleNovel(novel) {
    console.log(novel.name);
    let node = novelTemplate.content.cloneNode(true);
    
    let name = node.querySelector('.novel-name');
    
    name.textContent = novel.name;

    let link = node.querySelector('.novel-link');
    link.textContent = novel.lastChapter;
    
    return node;
    

}