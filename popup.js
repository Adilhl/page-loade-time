document.addEventListener('DOMContentLoaded', function () {
  // Request loading time data from the background script
  chrome.runtime.sendMessage({ message: "getLoadingTime" }, function (response) {
    if (response && response.loadingTime !== undefined) {
      var loadingTime = response.loadingTime;
      document.getElementById('loadingTime').textContent = loadingTime + ' ms';
    } else {
      console.error('Error: Unable to retrieve loading time data.');
    }
  });

  // Request request times data from the background script
  chrome.runtime.sendMessage({ message: "getRequestTimes" }, function (response) {
    if (response && response.requestTimes !== undefined && Array.isArray(response.requestTimes)) {
      var requestTimes = response.requestTimes;
      var timelineData = [];

      // Process request times data
      requestTimes.forEach(function (request) {
        timelineData.push({
          name: request.url,
          startTime: request.startTimestamp,
          duration: request.duration
        });
      });

      // Display request times data in the timeline
      var waterfallChart = document.getElementById('waterfallChart');
      waterfallChart.innerHTML = '';

      timelineData.forEach(function (event) {
        var eventElement = document.createElement('div');
        eventElement.className = 'timeline-event';
        eventElement.style.width = event.duration + 'px';
        eventElement.title = event.name + ': ' + event.duration.toFixed(1) + ' ms';
        eventElement.textContent = event.name;
        waterfallChart.appendChild(eventElement);
      });
    } else {
      console.error('Error: Unable to retrieve request times data.');
    }
  });

  // Initialize chart with dummy data or handle data retrieval separately
  var loadTimeData = {}; // Placeholder for load time data
  var ctx = document.getElementById('loadTimeChart').getContext('2d');

  var loadTimeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(loadTimeData),
      datasets: [{
        label: 'Load Time (ms)',
        data: Object.values(loadTimeData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
