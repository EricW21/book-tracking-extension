
let trackedWebsites = [];

chrome.storage.local.get(["trackedWebsites"]).then((result) => {
    trackedWebsites = result.trackedWebsites || [];
});

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.

    let [tab] = await chrome.tabs.query(queryOptions);
    
    if (tab) {
        let value=tab.url;
        
        
        if (!value) {
            value='error occured:'+JSON.stringify(tab)
        }
        logUrl(value);
        website = extractWebsite(value);
        
        
    }
    else {
        console.log('no tab')
    }
    
    return;
}

function logUrl(url) {
    // add a link to recent links (testing purposes), capped at 15

    value = extractWebsite(url);
    chrome.storage.local.get(["link"]).then((result) => {
        link = result.link
        if (!link || !Array.isArray(link)) {
            chrome.storage.local.set({ 'link': [value] }).then(() => {
                console.log("Value is set");
                });
        }
        else {
            if (link.length>15) {
                link.shift();
                
            }
            link.push(value,url);
            
            chrome.storage.local.set({ 'link': link  }).then(() => {
                console.log("Value is set");
            });
        }
        
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
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        await getCurrentTab();
    }
    
    
});

chrome.tabs.onCreated.addListener( async function(tab) {         
   await getCurrentTab();
});