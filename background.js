
/** @type {Set<string>} */
let trackedWebsites = new Set();

initializeTrackedWebsites();

/** 
 * @returns {Promise<void>}
 */
async function initializeTrackedWebsites() {
    console.log("initializing");
    try {
        const result = await chrome.storage.local.get(["trackedWebsites"]);
        trackedWebsites = new Set(result.trackedWebsites || []);

        /** @type {string[]} */
        const start = ["novelupdates.com", "wuxiaworld.com", "royalroad.com","comick.io"];
        start.forEach(addWebsite);
        start.forEach(site => trackedWebsites.add(site));
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

            /** @type {string[]} */
            const keywords = ["novel", "transla"];
            if (keywords.some(keyword => website.includes(keyword))) {
                await addWebsite(website);
            }
            return;
        }
        await addWebsite(website);
        
        logUrl(url);
    } else {
        console.log('no tab');
    }
}

/**
 * @param {string} url
 */
function logUrl(url) {
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
async function addWebsite(site) {
    if (isTrackedWebsite(site)) {
        return;
    }
    chrome.storage.local.set({ [site]: [] });
    trackedWebsites.add(site);
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