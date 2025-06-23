import { useEffect, useState } from 'react';

import './App.css'


/// <reference types="chrome" />

import type { Novel } from '@js/Novel.js';
import type { Website } from '@js/Website.js';

function App() {
  const [websites, setWebsites] = useState<string[]>([]);
  const [websiteDict, setWebsiteDict] = useState<Map<string, Novel[]>>(new Map());

  useEffect(() => {
    chrome.storage.local.get(["trackedWebsites"]).then((result) => {
      setWebsites(result.trackedWebsites || []);
      
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
                
              </div>
              
            ))}
          </div>
        )}
      </div>
      
      
    
  )
}

export default App
