const ctx = document.getElementById("scanChart");

new Chart(ctx, {
    type: "line",
    data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [{
            label: "Scans",
            data: [12, 19, 3, 5, 2, 8],
            borderWidth: 2,
            tension: 0.4
        }]
    },
    options: {
        responsive: true
    }
});