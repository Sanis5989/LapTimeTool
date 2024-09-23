let laps = [];

function addLap() {
    const playerName = document.getElementById('playerName').value;
    const lapTime = parseFloat(document.getElementById('lapTime').value);
    
    if (playerName && lapTime) {
        laps.push({ player: playerName, time: lapTime });
        updateTable();
    } else {
        alert('Please enter racer name and lap time');
    }
}

function updateTable() {
    const tableBody = document.querySelector('#lapsTable tbody');
    tableBody.innerHTML = ''; // Clear the table
    
    laps.forEach((lap, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${lap.player}</td>
            <td>${index + 1}</td>
            <td>${lap.time}</td>
        `;
        tableBody.appendChild(row);
    });
}

function compareTimes() {
    if (laps.length === 0) {
        alert('No lap data available for comparison');
        return;
    }

    let fastestLap = Math.min(...laps.map(lap => lap.time));
    let averageSpeed = laps.reduce((total, lap) => total + lap.time, 0) / laps.length;

    document.getElementById('fastestLap').textContent = `Fastest Lap: ${fastestLap.toFixed(2)} seconds`;
    document.getElementById('averageSpeed').textContent = `Average Lap Time: ${averageSpeed.toFixed(2)} seconds`;
}
