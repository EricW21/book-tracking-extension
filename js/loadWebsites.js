

let trackedWebsites = [];
let websiteTemplate;
let main;
let novelTemplate;

InitializePage()
let lastWebsite = new Website();



async function InitializePage() {

    document.getElementById('exportData').addEventListener('click', exportData);
    document.getElementById('importData').addEventListener('click', importData);


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
        const node = await LoadSingleNovel(novel,website);
        parent.append(node);
    }
    
    // append novel divs to the website div
    
}

async function LoadSingleNovel(novel,website) {
    
    let node = novelTemplate.content.cloneNode(true);
    
    let name = node.querySelector('.novel-name');
    
    name.textContent = novel.name;

    let link = node.querySelector('.novel-link');
    link.textContent = novel.lastChapter;
    link.href = website.recoverPath(novel,novel.lastChapter);
    return node;
    

}


async function importData() {

}

async function exportData() {
    chrome.storage.local.get(null, function(items) {
        
        const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = "novel_data_progress_tracker.json";
        a.click();

        URL.revokeObjectURL(url);
    });
}