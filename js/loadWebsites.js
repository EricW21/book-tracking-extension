

let trackedWebsites = [];
let websiteTemplate;

let novelTemplate;

InitializePage()

async function InitializePage() {
    websiteTemplate = document.getElementById("website-row-template");
    novelTemplate = document.getElementById("novel-row-template");
    const result = await chrome.storage.local.get(["trackedWebsites"]);
    trackedWebsites = new Set(result.trackedWebsites || []);
    LoadWebsites();
}



async function LoadWebsites() {
    // add the main div
    
    trackedWebsites.forEach(site => LoadSingleWebsite(site));
    
}

async function LoadSingleWebsite(site) {
    let parent = websiteTemplate.cloneNode(true);
	parent.removeAttribute('id');

    await LoadNovels(parent,site);

    // append the div to the main div

}

async function LoadNovels(parent,site) {
    let node = novelTemplate.cloneNode(true);
    node.removeAttribute('id');
    // create novel divs
    LoadSingleNovel(site);
    // append novel divs to the website div
    let main = document.getElementById("info-rows")
}

async function LoadSingleNovel(site) {
    
}