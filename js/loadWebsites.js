


let websiteTemplate;
let main;
let novelTemplate;

// 0 is timestamp

//1 for novels is popular
let novelFilters = {primary: "recent", order : "desc"};

//1 for websites is number of novels
let websiteFilters = {primary: "recent", order : "desc"};


InitializePage()


let tracked = new Set();


async function InitializePage() {
    document.getElementById("add-website-form").addEventListener("submit", handleWebsiteForm);
    document.getElementById('add-website-button').addEventListener('click',toggleWebsiteForm);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', importData);
    const checkbox = document.getElementById("novel-toggle");
    checkbox.checked = localStorage.getItem("novel-toggle")==="novel";

    checkbox.addEventListener('change',toggleNovel);
    


    websiteTemplate = document.getElementById("website-row-template");
    novelTemplate = document.getElementById("novel-row-template");
    const result = await chrome.storage.local.get(["trackedWebsites"]);
    tracked = new Set(result.trackedWebsites || []);
    
    console.log(tracked);
    main = document.getElementById("info-rows-template");
    refreshData();

    
    
    
    
}



async function LoadWebsites() {
    // add the main div
    
    let websiteList = [];
    for (const site of tracked) {
        let result = await chrome.storage.local.get([site]);
        console.log(result);
        websiteList.push(result[site]);
        
    }

    websiteList.sort((a,b)=> {
        let sign = 1;
        if (websiteFilters.order=='desc') {
            sign = -1;
        }
        // console.log("a "+ JSON.stringify(a));
        let first = (a["novels"].length>0) ? a["novels"].recentTimestamp : 0;
        let second = (b["novels"].length>0) ? b["novels"][0].recentTimestamp : 0;

        
        if (websiteFilters.primary==0) {
            return sign* (first-second);
        }

    })

    for (let i=0;i<websiteList.length;i++) {
        LoadSingleWebsite(websiteList[i]);
    }
    
}

function novelComparator(a,b)  {
    let sign = -1;
    if (websiteFilters.order=='desc') {
        sign = 1;
    }
    
    return sign*(b.recentTimestamp-a.recentTimestamp);
}

async function LoadSingleWebsite(websiteObject) {
    let site = websiteObject.domain;
    let parent = websiteTemplate.content.cloneNode(true);
    
    let websiteName = parent.querySelector('.website');

    websiteName.textContent=site;
    container = parent.querySelector('.novels-inside-websites');
    container.removeAttribute('id');
	
    
    await LoadNovels(container,websiteObject);
    main.append(parent);
    
   
    // append the div to the main div

}

async function LoadAllNovels(parent) {
    let novelList = [];
    for (const site of tracked) {
        const result = await chrome.storage.local.get([site]);
        let website = Website.fromJSON(result[site]);
        for (const novel of website.novels) {
            novelList.push(novel);
        }
    }

    novelList.sort(novelComparator);
    console.log(JSON.stringify(novelList, null, 2));
    for (const novel of novelList) {
        const node = await LoadSingleNovel(novel);
        main.append(node);
    }
    
}

async function LoadNovels(parent,websiteObject) {
    
    // create novel divs    

    
    let website = Website.fromJSON(websiteObject);

    let novelList = [];
    for (const novel of website.novels) {
        novelList.push(novel);
    }

    // add some sorting functionality here

    novelList.sort(novelComparator);
    for (const novel of novelList) {
        const node = await LoadSingleNovel(novel);
        parent.append(node);
    }
    
    // append novel divs to the website div
    
}

async function LoadSingleNovel(novel) {
    
    let node = novelTemplate.content.cloneNode(true);
    
    let name = node.querySelector('.novel-name');
    
    name.textContent = novel.name;

    let link = node.querySelector('.novel-link');
    link.textContent = novel.lastChapter;
    link.href = novel.recoverPath(novel.lastChapter);

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
    refreshData();
}

async function handleWebsiteForm(event) {
    
    const novelText = document.getElementById("website-novel").value.trim();
    const chapterText = document.getElementById("website-chapter").value.trim();
    let novelUrl;
    let chapterUrl;
    try {
        novelUrl = new URL(novelText);
        chapterUrl = new URL(chapterText);
        console.log(novelUrl.hostname);
    }
    catch {
        alert("Not a Valid URL");
        event.preventDefault();
    }
    
    
    let novelSite = extractWebsite(novelText);
    let chapterSite = extractWebsite(chapterText);
    
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

    let novelIndex = novelUrl.pathname.split("/").length;
    let chapterIndex = chapterUrl.pathname.split("/").length;

    console.log(novelIndex);
    console.log(chapterIndex);
    let addedWebsite = new Website(novelSite,novelIndex-2,chapterIndex-2);
    tracked.add(addedWebsite.domain);
    chrome.storage.local.set({ trackedWebsites: Array.from(tracked) });
    setWebsite(addedWebsite);

    chrome.storage.local.get(null, function(items) {
        
        console.log(items);
    });
    //.pathname.split("/").filter(Boolean);
    // console.log("novel" + novelUrl);
    // console.log("chapter" + chapterUrl);


}


async function toggleNovel() {
    let toggleValue = localStorage.getItem("novel-toggle");
    if (toggleValue==="novel") {
        localStorage.setItem("novel-toggle","website");
    }
    else {
        localStorage.setItem("novel-toggle","novel");
    }
    
    console.log("toggled" + localStorage.getItem("novel-toggle"));
    refreshData();
}

async function refreshData() {
    
    main.innerHTML = "";
    let toggleValue = localStorage.getItem('novel-toggle');
    if (toggleValue===null || toggleValue==="website") {
        console.log("loading websites");
        await LoadWebsites();
    }
    else {
        console.log("loading all novels");
        await LoadAllNovels();
    }
}