

async function test() {
    chrome.storage.local.get(["link"]).then((result) => {
        console.log("Value is " + result.key);
        document.getElementById('title-container').innerHTML=JSON.stringify(result);
    });
    
}

document.addEventListener('DOMContentLoaded', function() {
    test();
});

