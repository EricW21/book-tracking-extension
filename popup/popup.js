

async function test() {
    chrome.storage.local.get(["link"]).then((result) => {
        const linkArray = result.link || [];
        document.getElementById('title-container').innerHTML=linkArray.map(item => `<div>${item}</div>`).join('');
    });
    
}

document.addEventListener('DOMContentLoaded', function() {
    test();
});

document.getElementById("website-button").addEventListener("click", function () {
    window.open("../react-website/dist/index.html", "_blank");
})
