// Initialize the list of blocked hosts
let blockedDomainsArray = ["example.com", "example.org"];
let blockedDomainsRegex = regex_from_array(blockedDomainsArray)
console.log(`balblablaaa!!!`);

function regex_from_array(domainsArray) {
  return  new RegExp("(.*"+domainsArray.join('.*)|(.*').replace('.','\\.')+".*)", "i")
}


// Set the default list on installation.
browser.runtime.onInstalled.addListener(details => {
  browser.storage.local.set({
    blockedDomainsArray: blockedDomainsArray,
  });
});

// Get the stored regex
browser.storage.local.get(data => {
  if (data.blockedDomainsArray) {
    console.log(`storage get0`);
    blockedDomainsArray = data.blockedDomainsArray
    blockedDomainsRegex = regex_from_array(blockedDomainsArray);
    console.log(`storage get1`);
  }
});

// Listen for changes in the blocked list
browser.storage.onChanged.addListener(changeData => {
  console.log(`storage changed0`);
  blockedDomainsArray = changeData.blockedDomainsArray.newValue
  blockedDomainsRegex = regex_from_array(blockedDomainsArray);
  console.log(`storage changed1`);
});


function listener(requestInfo) {
  const url = new URL(requestInfo.url);
  console.log(`listening...${url.hostname}`);
  if (blockedDomainsRegex.test(url.hostname)) {
    console.log(`its blocked`);
  return {redirectUrl: "http://ikossaczky.github.io/"};
  }
  return {};
};

// Listen for a request to open a webpage
// browser.webRequest.onBeforeRequest.addListener(listener, {urls: ["<all_urls>"], types: ["main_frame"]},["blocking"]);

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["<all_urls>"]},
  ["blocking"]
);




