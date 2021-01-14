const blockedDomainsTextArea = document.getElementById("blocklist_elem");
var i;
const dayCheckboxArray = []
for (i = 0; i < 7; i++) {
  dayCheckboxArray.push(document.getElementById("day"+i.toString()+"_elem"))
} 
const timeEntry = document.getElementById("time_elem");
const htmlElemArray = dayCheckboxArray.concat([blockedDomainsTextArea, timeEntry])

// Store the currently selected settings using browser.storage.local.
function storeSettings() {
  let blockedDomainsArray = blockedDomainsTextArea.value.split("\n");
  let dayArray = []
  let i;
  for (i = 0; i < dayCheckboxArray.length; i++) {
    dayArray[i] = dayCheckboxArray[i].checked
  } 
  let time = timeEntry.value
  browser.storage.local.set({
    blockedDomainsArray: blockedDomainsArray,
    dayArray: dayArray,
    time: time
  });
}

// Update the options UI with the settings values retrieved from storage,
// or the default settings if the stored settings are empty.
function updateUI(restoredSettings) {
  blockedDomainsTextArea.value = restoredSettings.blockedDomainsArray.join("\n");
  let i;
  for (i = 0; i < dayCheckboxArray.length; i++) {
    dayCheckboxArray[i].checked = restoredSettings.dayArray[i]
  } 
  timeEntry.value = restoredSettings.time
}

function onError(e) {
  console.error(e);
}

// On opening the options page, fetch stored settings and update the UI with them.
browser.storage.local.get().then(updateUI, onError);

// Whenever the contents of the textarea changes, save the new values
//blockedDomainsTextArea.addEventListener("change", storeSettings);
var i;
for (i = 0; i < htmlElemArray.length; i++) {
  htmlElemArray[i].addEventListener("change", storeSettings);
} 