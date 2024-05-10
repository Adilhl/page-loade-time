chrome.runtime.sendMessage({message: "getLoadingTime"}, function(response) {
  // console.log(response.loadingTime);
});
var navigationTiming = performance.getEntriesByType("navigation")[0];

var loadTimes = {
  "Redirect": navigationTiming.redirectEnd - navigationTiming.redirectStart,
  "DNS": navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
  "Connect": navigationTiming.connectEnd - navigationTiming.connectStart,
  "Request": navigationTiming.responseStart - navigationTiming.requestStart,
  "Response": navigationTiming.responseEnd - navigationTiming.responseStart,
  "DOM": navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart
};

chrome.runtime.sendMessage({ message: "loadTimes", data: loadTimes });
