
/** @type {Set<string>} */
let trackedWebsites = new Set();

initializeTrackedWebsites();

/** @type {string[]} */

// const keywords = ["novel", "transla", "manga"];
const keywords = ["novel"];

let lastWebsite = new Website();



const startingSites = [
    ["novelupdates.com", 1, 2],
    ["wuxiaworld.com", 1, 2],
    ["royalroad.com", 1, 4],
    ["comick.io", 1, 2],
    ["mangadex.org", 1, 2],
];


/** 
 * @returns {Promise<void>}
 */
async function initializeTrackedWebsites() {
    console.log("initializing");
    try {
        const result = await chrome.storage.local.get(["trackedWebsites"]);
        trackedWebsites = new Set(result.trackedWebsites || []);

        
        startingSites.forEach(([site, novelIndex, chapterIndex]) => {
            addWebsite(site, novelIndex, chapterIndex);
        });
        
    } catch (error) {
        console.error("Error retrieving tracked websites:", error);
    }
}

/**
 * @returns {Promise<void>}
 */
async function getCurrentTab() {
    /** @type {{ active: boolean; lastFocusedWindow: boolean }} */
    let queryOptions = { active: true, lastFocusedWindow: true };

    /** @type {(chrome.tabs.Tab | undefined)[]} */
    let [tab] = await chrome.tabs.query(queryOptions);
    
    if (tab && tab.url) {

        /** @type {string} */
        let url = tab.url;
        
        console.log("original url: " + url);
        
        /** @type {string} */
        let website = extractWebsite(url);
        if (website == "") {
            console.log("not a website");
            return;
        }
        
        if (!isTrackedWebsite(website)) {
            console.log("not a tracked website");

            
            if (keywords.some(keyword => website.includes(keyword))) {
                await addWebsite(website);
            }
            return;
        }
        console.log(" about to get updated");
        await updateWebsite(website,url);
        console.log("last website: " + lastWebsite.getDomain());
        logUrl(url);
    } else {
        console.log('no tab');
    }
}

async function SetRecentWebsite(site) {
    if (lastWebsite.getDomain() !== site) {
        const result = await chrome.storage.local.get([site]);
        if (result[site]) {
            lastWebsite = Website.fromJSON(result[site]);
        } else {
            lastWebsite = new Website(site);
        }
    }
}

// (website should be added before the updateWebsite function)
async function updateWebsite(website,url) {
    
    await SetRecentWebsite(website);

    console.log("last website should be " + website + " and is " + lastWebsite.getDomain());

    


    lastWebsite.updateNovel(new URL(url).pathname.split("/").filter(Boolean),Date.now());
    console.log("last website after update: " , lastWebsite);

    setWebsite(lastWebsite);
    // await chrome.storage.local.set({ [website]: lastWebsite.toJSON() }).then(() => {
    //     console.log("Website updated:", lastWebsite);
    // });

    chrome.storage.local.get(null, function(items) {
        
        console.log(items);
    });
}

/**
 * @param {string} url
 */
function logUrl(url) {
    console.log("Logging URL: " + url);
    chrome.storage.local.get(["link"]).then((result) => {
        /** @type {string[]} */
        let link = result.link || [];
        console.log(link.length);
        if (link.length > 15) {
            link.shift();
        }
        link.push(url);
        console.log(link);
        console.log(link.length);
        chrome.storage.local.set({ "link": link }).then(() => {
            console.log("Value is set");
        });
        
    });
}

/**
 * @param {string} url
 * @returns {string}
 */
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
        return "";
    }
}

/**
 * @param {string} site
 * @returns {Promise<void>}
 */
async function addWebsite(site, novelIndex, chapterIndex) {
    if (isTrackedWebsite(site)) {
        return;
    }
    chrome.storage.local.set({ [site]: new Website(site,novelIndex,chapterIndex).toJSON() });
    
    trackedWebsites.add(site);
    chrome.storage.local.set({ trackedWebsites: Array.from(trackedWebsites) });
    SetRecentWebsite(site);
    chrome.storage.local.get(null, function(items) {
        
        console.log(items);
    });
}





/**
 * @param {string} site
 * @returns {boolean}
 */
function isTrackedWebsite(site) {
    return trackedWebsites.has(site);
}

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        await getCurrentTab();
    }
});

chrome.tabs.onCreated.addListener(async function(tab) {
    await getCurrentTab();
});



