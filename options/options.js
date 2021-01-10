const blockedDomainsTextArea = document.querySelector("#blocked-hosts");

// Store the currently selected settings using browser.storage.local.
function storeSettings() {
  let blockedDomainsArray = blockedDomainsTextArea.value.split("\n");
  browser.storage.local.set({
    blockedDomainsArray: blockedDomainsArray,
  });
}

// Update the options UI with the settings values retrieved from storage,
// or the default settings if the stored settings are empty.
function updateUI(restoredSettings) {
  blockedDomainsTextArea.value = restoredSettings.blockedDomainsArray.join("\n");
}

function onError(e) {
  console.error(e);
}

// On opening the options page, fetch stored settings and update the UI with them.
browser.storage.local.get().then(updateUI, onError);

// Whenever the contents of the textarea changes, save the new values
blockedDomainsTextArea.addEventListener("change", storeSettings);
