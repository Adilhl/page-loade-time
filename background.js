var pageLoadTimes = {};

chrome.webNavigation.onCompleted.addListener(function (details) {
  var startTime = pageLoadTimes[details.tabId];
  if (startTime) {
    var loadingTime = details.timeStamp - startTime;
    var loadingTimeInSeconds = (loadingTime / 1000).toFixed(1);
    chrome.action.setBadgeText({ text: loadingTimeInSeconds + 's' });
  }
});

chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  pageLoadTimes[details.tabId] = details.timeStamp;
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  var tabId = activeInfo.tabId;
  chrome.action.setBadgeText({ text: '' }); // Clear badge text when changing tabs
  delete pageLoadTimes[tabId]; // Reset the loading time for the newly activated tab
});

chrome.tabs.onRemoved.addListener(function (tabId) {
  delete pageLoadTimes[tabId]; // Remove the recorded start time when a tab is closed
});

function getLoadingTime() {
  return chrome.action.getBadgeText({});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "getLoadingTime") {
    var loadingTime = getLoadingTime();
    sendResponse({ loadingTime: loadingTime });
  }
});

