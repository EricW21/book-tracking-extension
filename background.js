
async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.

    let [tab] = await chrome.tabs.query(queryOptions);
    
    if (tab) {
        
        let value=tab.url;
        console.log(JSON.stringify(tab))
        if (!value) {
            value='error occured:'+JSON.stringify(tab)
        }
        chrome.storage.local.get(["link"]).then((result) => {
            link = result.link
            if (!link || !Array.isArray(link)) {
                chrome.storage.local.set({ 'link': [value] }).then(() => {
                    console.log("Value is set");
                  });
            }
            else {
                if (link.length>20) {
                    link = []
                }
                link.push(value);
                
                chrome.storage.local.set({ 'link': link  }).then(() => {
                    console.log("Value is set");
                  });
            }
            
        });
        
    }
    else {
        console.log('no tab')
    }
    
    return;
}
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        await getCurrentTab();
    }
    
    
});

chrome.tabs.onCreated.addListener( async function(tab) {         
   await getCurrentTab();
});