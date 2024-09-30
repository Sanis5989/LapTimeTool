let laps = [];

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

//simulating fetch from api
async function fetchRaceLapData() {
    try {
      const response = await fetch("lapdata.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      return await response.json();
    } catch (error) {
      console.error("Could not fetch race data:", error);
      return [];
    }
  }


// JSON data (you would typically fetch this from a server)
let jsonData = [];
  
  // Function to load racers into the select dropdown
  async function loadRacers() {


    jsonData = await fetchRaceLapData();

    const racerSelect = document.getElementById('racerSelect');
    jsonData.forEach((racerData, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.text = racerData.racer;
      racerSelect.appendChild(option);
    });
  }
  
  // Function to display the selected racer's laps in the table
  function displayLaps() {
    const racerSelect = document.getElementById('racerSelect');
    const lapsTable = document.getElementById('lapsTable').getElementsByTagName('tbody')[0];
    const selectedRacerIndex = racerSelect.value;
    const displaySelected = document.getElementById('selectedRacer')
    displaySelected.innerHTML = jsonData[racerSelect.value].racer
    // Clear the table before adding new rows
    lapsTable.innerHTML = '';
  
    if (selectedRacerIndex !== '') {
      const racerData = jsonData[selectedRacerIndex];
  
      // Populate the table with the selected racer's laps
      racerData.laps.forEach((lap) => {


        const row = lapsTable.insertRow();
        row.insertCell(0).textContent = lap.lapNumber;
        row.insertCell(1).textContent = lap.lapTime;
        row.insertCell(2).textContent = lap.averageSpeed;
      });
    }
  }
  
  // Function to compare lap times (you can customize this as needed)
  function moreStats() {
    const racerSelect = document.getElementById('racerSelect');
    const selectedRacerIndex = racerSelect.value;
    
    if (selectedRacerIndex !== '') {
      const racerData = jsonData[selectedRacerIndex];
      
      // Find the fastest lap time
      const fastestLap = racerData.laps.reduce((min, lap) => lap.lapTime < min.lapTime ? lap : min);
      document.getElementById('fastestLap').textContent = `Fastest Lap Time: ${fastestLap.lapTime}`;
      
      // Calculate average speed
      const totalSpeed = racerData.laps.reduce((sum, lap) => sum + lap.averageSpeed, 0);
      const averageSpeed = (totalSpeed / racerData.laps.length).toFixed(2);
      document.getElementById('averageSpeed').textContent = `Average Speed: ${averageSpeed} km/h`;
    } else {
      alert('Please select a racer to view more.');
    }
  }

  // Populate select options
    function loadCompareSelect() {
    const racer1Select = document.getElementById("racer1Select");
    const racer2Select = document.getElementById("racer2Select");
    console.log(jsonData)
  
    jsonData.forEach((racer, index) => {
      const option1 = document.createElement("option");
      option1.value = index;
      option1.text = racer.racer;
      racer1Select.add(option1);
  
      const option2 = document.createElement("option");
      option2.value = index;
      option2.text = racer.racer;
      racer2Select.add(option2);
    });
  };


  // Function to convert lap time in "MM:SS.SSS" format to total seconds
function convertLapTimeToSeconds(lapTime) {
    const [minutes, seconds] = lapTime.split(':');
    return parseFloat(minutes) * 60 + parseFloat(seconds);
}

// Function to compare racers and display data
function displayComparison() {
    const racer1Index = document.getElementById("racer1Select").value;
    const racer2Index = document.getElementById("racer2Select").value;
    const tableBody = document.querySelector("#compareLapsTable tbody");
    const tableHeader = document.getElementById("tableHeader");

    // Clear previous table rows
    tableBody.innerHTML = "";

    if (racer1Index && racer2Index) {
        const racer1 = jsonData[racer1Index];
        const racer2 = jsonData[racer2Index];

        // Update table header with racer names
        tableHeader.innerHTML = `
            <th>Lap Number</th>
            <th>${racer1.racer}: Lap Time (seconds)</th>
            <th>${racer1.racer}: Average Speed</th>
            <th>${racer2.racer}: Lap Time (seconds)</th>
            <th>${racer2.racer}: Average Speed</th>
            <th>Time Difference (seconds)</th>
            <th>Speed Difference</th>
        `;

        // Find the maximum number of laps between the two racers
        const maxLaps = Math.max(racer1.laps.length, racer2.laps.length);

        let totalRacer1Time = 0;
        let totalRacer2Time = 0;
        let totalRacer1Speed = 0;
        let totalRacer2Speed = 0;
        let lapsCount1 = 0;
        let lapsCount2 = 0;

        // Create rows for each lap
        for (let i = 0; i < maxLaps; i++) {
            const lapNumber = i + 1;
            const racer1Lap = racer1.laps[i] || { lapTime: "-", averageSpeed: "-" };
            const racer2Lap = racer2.laps[i] || { lapTime: "-", averageSpeed: "-" };

            // Calculate total seconds for lap times if data is available
            const racer1LapTimeInSeconds = racer1Lap.lapTime !== "-" ? convertLapTimeToSeconds(racer1Lap.lapTime) : null;
            const racer2LapTimeInSeconds = racer2Lap.lapTime !== "-" ? convertLapTimeToSeconds(racer2Lap.lapTime) : null;

            // Calculate time and speed differences (if data is available for both racers)
            const lapTimeDifference = 
                racer1LapTimeInSeconds !== null && racer2LapTimeInSeconds !== null 
                    ? (racer2LapTimeInSeconds - racer1LapTimeInSeconds).toFixed(3)
                    : "-";
            const speedDifference = 
                racer1Lap.averageSpeed !== "-" && racer2Lap.averageSpeed !== "-" 
                    ? (parseFloat(racer2Lap.averageSpeed) - parseFloat(racer1Lap.averageSpeed)).toFixed(2)
                    : "-";

            // Update totals for overall statistics
            if (racer1LapTimeInSeconds !== null) {
                totalRacer1Time += racer1LapTimeInSeconds;
                totalRacer1Speed += parseFloat(racer1Lap.averageSpeed);
                lapsCount1++;
            }
            if (racer2LapTimeInSeconds !== null) {
                totalRacer2Time += racer2LapTimeInSeconds;
                totalRacer2Speed += parseFloat(racer2Lap.averageSpeed);
                lapsCount2++;
            }

            const row = `
                <tr>
                    <td>${lapNumber}</td>
                    <td>${racer1Lap.lapTime}</td>
                    <td>${racer1Lap.averageSpeed}</td>
                    <td>${racer2Lap.lapTime}</td>
                    <td>${racer2Lap.averageSpeed}</td>
                    <td>${lapTimeDifference}</td>
                    <td>${speedDifference}</td>
                </tr>
            `;

            tableBody.innerHTML += row;
        }

        // Calculate overall statistics
        const overallRacer1Time = totalRacer1Time.toFixed(3);
        const overallRacer2Time = totalRacer2Time.toFixed(3);
        const overallRacer1AverageSpeed = (totalRacer1Speed / lapsCount1).toFixed(2);
        const overallRacer2AverageSpeed = (totalRacer2Speed / lapsCount2).toFixed(2);
        const overallSpeedDiff = (overallRacer1AverageSpeed - overallRacer2AverageSpeed).toFixed(2);
        const overallTimeDiff = (overallRacer1Time - overallRacer2Time).toFixed(2);

        // Add overall statistics row
        const overallRow = `
            <tr>
                <td>Overall</td>
                <td>${overallRacer1Time}</td>
                <td>${overallRacer1AverageSpeed}</td>
                <td>${overallRacer2Time}</td>
                <td>${overallRacer2AverageSpeed}</td>
                <td>${overallTimeDiff}</td>
                <td>${overallSpeedDiff}</td>
            </tr>
        `;

        tableBody.innerHTML += overallRow;
    }
}


  
  // Call this function when the page loads to populate the racer select dropdown
  window.onload = async()=>{
    await loadRacers();
    loadCompareSelect();
    } 
  