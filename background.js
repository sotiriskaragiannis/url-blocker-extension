let blocklist = [];

fetch(chrome.runtime.getURL("blocklist.json"))
  .then(response => response.json())
  .then(data => {
    blocklist = data.blocklist.map(item => item.toLowerCase());
  });

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);
    const hostname = url.hostname.toLowerCase();
    const fullPath = hostname + url.pathname.toLowerCase();

    for (let blocked of blocklist) {
      if (
        hostname === blocked ||
        fullPath.startsWith(blocked)
      ) {
        return { cancel: true };
      }
    }

    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
