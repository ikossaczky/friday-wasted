// Initialization
let blockedDomainsArray = ["example.com", "example.org"];
let blockedDomainsRegex = regex_from_array(blockedDomainsArray)
let dayArray = [false, false, false, false, false, true, false]
let time="20:00"
let minutes_threshold = int_from_time(time)


function regex_from_array(domainsArray) {
  console.log("changing regex!")
  return  new RegExp(("(.*"+domainsArray.join('.*)|(.*').replace('.','\\.')+".*)").replaceAll("|(.*.*)",""), "i")
}
function int_from_time(time) {
  return parseInt(time.substr(0,2))*60 + parseInt(time.substr(3,4))
}

// Get the stored regex
chrome.storage.local.get(data => {
  if (data.blockedDomainsArray) {
    //console.log(`storage get0`);
    //console.log(data)
    blockedDomainsArray = data.blockedDomainsArray
    blockedDomainsRegex = regex_from_array(blockedDomainsArray);
    time = data.time
    minutes_threshold = int_from_time(time)
    dayArray = data.dayArray
    console.log(`storage get1`);
  }

});
  
// Set the default list on installation.
chrome.runtime.onInstalled.addListener(details => {
  chrome.storage.local.get(data => {
    if (!data.blockedDomainsArray) {
      chrome.storage.local.set({
        blockedDomainsArray: blockedDomainsArray,
        dayArray: dayArray,
        time: time
      });
      console.log("setting initial data!")
      console.log(~data.blockedDomainsArray)
    }
    else
    {console.log("reusing data")}
  })

});

// Listen for changes in the blocked list
chrome.storage.onChanged.addListener(changeData => {
  console.log(`storage changed0`);
  console.log(changeData)
  blockedDomainsArray = changeData.blockedDomainsArray.newValue
  blockedDomainsRegex = regex_from_array(blockedDomainsArray);
  time = changeData.time.newValue
  minutes_threshold = int_from_time(time)
  dayArray = changeData.dayArray.newValue
  console.log(`storage changed1`);
});

function listener(requestInfo) {
  const url = new URL(requestInfo.url);
  var d = new Date()
  day = d.getDay()
  var current_minutes = d.getHours()*60 + d.getMinutes()
  console.log(`listening...${url.hostname}`);
  if (blockedDomainsRegex.test(url.hostname)) {
    if (!dayArray[day] || current_minutes<minutes_threshold) {
      console.log(`its blocked`);
      return {redirectUrl: "http://example.net/"};
    }
  }
  return {};
};

// Listen for a request to open a webpage
chrome.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["<all_urls>"]},
  ["blocking"]
);
