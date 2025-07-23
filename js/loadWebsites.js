


let websiteTemplate;
let main;
let novelTemplate;

InitializePage()


let tracked = new Set();


async function InitializePage() {
    document.getElementById("add-website-form").addEventListener("submit", handleWebsiteForm);
    document.getElementById('add-website-button').addEventListener('click',toggleWebsiteForm);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', importData);


    websiteTemplate = document.getElementById("website-row-template");
    novelTemplate = document.getElementById("novel-row-template");
    const result = await chrome.storage.local.get(["trackedWebsites"]);
    tracked = new Set(result.trackedWebsites || []);
    
    console.log(tracked);
    main = document.getElementById("info-rows-template");

    // let novelToggle = document.getElementById("toggle-novel");
    // if (novelToggle && novelToggle.textContent.trim()!="View by Novel") {
    //     novelToggle.textContent = "View by Website";
    //     await LoadAllNovels(main);
    // }
    // else {
    //     novelToggle.textContent="View by Novel";
    //     await LoadWebsites();
    // }

    await LoadWebsites();
    
    
}



async function LoadWebsites() {
    // add the main div
    
    for (const site of tracked) {
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

async function LoadAllNovels(parent) {
    for (const site of tracked) {
        const result = await chrome.storage.local.get([site]);
        let website = Website.fromJSON(result[site]);
        for (const novel of website.novels) {
            const node = await LoadSingleNovel(novel,website);
            parent.append(node);
        }
    }
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

    let timestamp = node.querySelector('.novel-timestamp');
    const novelDate = new Date(novel.recentTimestamp); // Assuming numericDate is a timestamp

    const day = String(novelDate.getDate()).padStart(2, '0');
    const month = String(novelDate.getMonth() + 1).padStart(2, '0'); // Add 1 as month is 0-indexed
    const year = novelDate.getFullYear();


    timestamp.textContent = `${month}/${day}/${year}`;

    
    console.log(novel);

    return node;
    

}



async function importData() {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
    fileInput.onchange = async (event) => {
        const file = event.target.files[0];

        if (file) {
            try {
            const text = await file.text();
            const jsonData = JSON.parse(text); 
            loadJsonData(jsonData);
            console.log("JSON object:", jsonData);
            } catch (error) {
            console.error("Error reading or parsing JSON file:", error);
            }
        }
    }
}

async function loadJsonData(jsonData) {
    
    
    console.log("Entries in jsonData:", Object.keys(jsonData).length);
    for (const [key, value] of Object.entries(jsonData)) {
        if (typeof value === 'object' && !Array.isArray(value) && value.domain) {
            if (performance?.memory) {
                console.log(`🧠 Memory BEFORE processing "${key}":`, performance.memory.usedJSHeapSize);
            }
            console.log("key and value: ",key,JSON.stringify(value, null, 2));
            const result = await chrome.storage.local.get([key]);
            
            let firstWebsite = Website.fromJSON(result[key]);
            
            let website  = Website.fromJSON(value);

            
            firstWebsite.addWebsite(website);
            setWebsite(firstWebsite);

            
            if (!tracked.has(website.domain)) {
                tracked.add(website.domain);
                chrome.storage.local.set({ trackedWebsites: [...tracked] });
            }  

            if (performance?.memory) {
                console.log(`🧠 Memory AFTEr Processing "${key}":`, performance.memory.usedJSHeapSize);
            }
        }
    }
    location.reload();
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


function toggleWebsiteForm() {  
    const form = document.getElementById("add-website-div");
    if (form.style.display === "none" || form.style.display=="") {
      form.style.display = "block";
    } else {
      form.style.display = "none";
    }
}

async function handleWebsiteForm(event) {
    
    const novelText = document.getElementById("website-novel").value.trim();
    const chapterText = document.getElementById("website-chapter").value.trim();
    let novelUrl = new URL(novelText);
    let chapterUrl = new URL(chapterText);

    let novelSite = extractWebsite(novelText);
    let chapterSite = extractWebsite(chapterText);
    console.log(novelUrl.hostname);
    console.log(chapterUrl.hostname);
    console.log(novelSite);
    if (novelSite!=chapterSite) {
        alert("novel links are from different websites");
        event.preventDefault();
    }
    else if (tracked.has(novelSite)) {
        alert("website is already being tracked");
        event.preventDefault();
    }


    //.pathname.split("/").filter(Boolean);
    console.log("novel" + novelUrl);
    console.log("chapter" + chapterUrl);


}

