
let trackedWebsites = [];

initializeTrackedWebsites();
async function initializeTrackedWebsites() {
    try {
        const result = await chrome.storage.local.get(["trackedWebsites"]);
        let trackedWebsites = result.trackedWebsites || [];
        const start = ["novelupdates.com", "wuxiaworld.com", "royalroad.com"];
        trackedWebsites = trackedWebsites.concat(start);
        start.forEach(addWebsite);
    } catch (error) {
        console.error("Error retrieving tracked websites:", error);
    }
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.

    let [tab] = await chrome.tabs.query(queryOptions);
    
    if (tab) {
        let url=tab.url;
        
        console.log("original url: " + url);
        
        
        website = extractWebsite(url);
        if (website=="") {
            console.log("not a website");
            return;
        }
        if (!checkWebsite(website)) {
            console.log("not a tracked website");
            return;
        }
        addWebsite(website);
        console.log("logged");
        logUrl(url);

        /// here should be good to put functionality to record novels as part of websites
        
        
        
    }
    else {
        console.log('no tab')
    }
    
    return;
}

function logUrl(url) {
    // add a link to recent links (testing purposes), capped at 15

    
    chrome.storage.local.get(["link"]).then((result) => {
        let link = result.link || [];
        console.log(link.length);

        
        if (link.length>15) {
            link.shift();
            
        }
        link.push(url);
        console.log(link);
        console.log(link.length);
        chrome.storage.local.set({ "link": link  }).then(() => {
            console.log("Value is set");
        });
        
        
    });
}
function extractWebsite(url) {
    try {
        const hostname = new URL(url).hostname;

        const parts = hostname.split('.');
        if (parts.length >= 2) {
        return parts.slice(-2).join('.'); 
        }

        return hostname; 
    } catch (e) {
        console.error("Not an URL", url);
        return null;
    }
}
async function addWebsite(site) {
    tracked = true;
    await chrome.storage.local.get([site]).then((result) => {
        console.log("result[site]: "+result[site]);
        if (result[site]==undefined) {
            tracked=false;
        }
        
    })
    if (!tracked) {
        chrome.storage.local.set({ [site]: []  });
    }
    
}
async function checkWebsite(site) {
    tracked = true;
    await chrome.storage.local.get(null).then((allData) => {
        console.log(allData); // See all keys and values
    });
    await chrome.storage.local.get([site]).then((result) => {
        console.log("result[site]: "+result[site]);
        if (result[site]==undefined) {
            tracked=false;
        }
        
    })
    return tracked;
}
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        await getCurrentTab();
    }
    
    
});

chrome.tabs.onCreated.addListener( async function(tab) {         
   await getCurrentTab();
});