import { useEffect, useState } from 'react';

import './App.css'

function App() {
  const [websites, setWebsites] = useState<string[]>([]);
  
  useEffect(() => {
    chrome.storage.local.get(["trackedWebsites"]).then((result) => {
      setWebsites(result.trackedWebsites || ["hello"]);
      
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
