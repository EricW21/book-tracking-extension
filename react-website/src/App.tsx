import { useEffect, useState } from 'react';

import './App.css'


/// <reference types="chrome" />


import { Website } from './Website.js';

function App() {
  const [websites, setWebsites] = useState<string[]>([]);
  const [websiteDict, setWebsiteDict] = useState<Map<string, Website>>(new Map());

  useEffect(() => {
  chrome.storage.local.get(["trackedWebsites"]).then((result) => {
    const websites: string[] = result.trackedWebsites || [];
    setWebsites(websites);

  
    const promises = websites.map(site =>
      chrome.storage.local.get([site]).then((res) => {
        const websiteData = res[site];
        if (websiteData) {
          return [site, Website.fromJSON(websiteData)] as const;
        } else {
          return [site, new Website(site)] as const;
        }
      })
    );

    // Wait for all promises to complete
    Promise.all(promises).then(entries => {
      
      const map = new Map<string, Website>(entries);
      setWebsiteDict(map);
    });
  });
}, []);
  return (
    
      <div>
        
        <h1>Tracked Websites</h1>
        {websites.length === 0 ? (
        <div>No websites tracked yet.</div>
        ) : (
          <div>
            {websites.map((site) => (
              <div key={site}>
                <h2>{site}</h2>
                
                {websiteDict.get(site)?.novels.map((novel, index) => 
                  <p key={index}>{novel.name}, Last Chapter: {novel.lastChapter}</p>)}
              </div>
              
            ))}
          </div>
        )}
      </div>
      
      
    
  )
}

export default App
