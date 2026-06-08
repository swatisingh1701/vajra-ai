const ctx = document.getElementById('scanChart');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Scans',
        data: [12, 19, 3, 5, 2, 8],
        borderColor: 'blue',
        tension: 0.4
      }
    ]
  }
});