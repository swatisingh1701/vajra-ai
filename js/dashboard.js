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

const userName = localStorage.getItem("userName");

if(userName){

    document.getElementById("welcomeText").innerHTML =
    `Good Evening, ${userName} 👋`;

}
else{

    document.getElementById("welcomeText").innerHTML =
    "Good Evening, Guardian 👋";

}