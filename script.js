// Get all nedded DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const maxCountDisplay = document.getElementById("maxCountDisplay");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCountElement = document.getElementById("waterCount");
const zeroCountElement = document.getElementById("zeroCount");
const powerCountElement = document.getElementById("powerCount");
const attendeeListElement = document.getElementById("attendeeList");
const resetButton = document.getElementById("resetBtn");

// Track attendance
let count = 0;
const maxCount = 6; // Set your attendance goal here
let attendees = [];

// Show max attendance goal in the UI
maxCountDisplay.textContent = maxCount;

// Read a number from localStorage safely
function getStoredNumber(key) {
  const savedValue = parseInt(localStorage.getItem(key));

  if (isNaN(savedValue) || savedValue < 0) {
    return 0;
  }

  return savedValue;
}

// Save all counters to localStorage
function saveCountsToStorage() {
  localStorage.setItem("attendanceTotal", count);
  localStorage.setItem("attendanceWater", waterCountElement.textContent);
  localStorage.setItem("attendanceZero", zeroCountElement.textContent);
  localStorage.setItem("attendancePower", powerCountElement.textContent);
}

function saveAttendeesToStorage() {
  localStorage.setItem("attendanceList", JSON.stringify(attendees));
}

function getStoredAttendees() {
  const savedList = localStorage.getItem("attendanceList");

  if (!savedList) {
    return [];
  }

  try {
    const parsedList = JSON.parse(savedList);

    if (Array.isArray(parsedList)) {
      return parsedList;
    }

    return [];
  } catch (error) {
    return [];
  }
}

function renderAttendeeList() {
  attendeeListElement.innerHTML = "";

  attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    listItem.className = "attendee-list-item";

    const attendeeName = document.createElement("span");
    attendeeName.className = "attendee-list-name";
    attendeeName.textContent = attendee.name;

    const attendeeTeam = document.createElement("span");
    attendeeTeam.className = "attendee-list-team";
    attendeeTeam.textContent = attendee.team;

    listItem.appendChild(attendeeName);
    listItem.appendChild(attendeeTeam);
    attendeeListElement.appendChild(listItem);
  });
}

function resetAllData() {
  count = 0;
  attendees = [];

  attendeeCount.textContent = 0;
  waterCountElement.textContent = 0;
  zeroCountElement.textContent = 0;
  powerCountElement.textContent = 0;
  progressBar.style.width = "0%";

  renderAttendeeList();

  greeting.textContent = "All attendance data has been reset.";
  greeting.className = "success-message";
  greeting.style.display = "block";

  form.reset();

  localStorage.removeItem("attendanceTotal");
  localStorage.removeItem("attendanceWater");
  localStorage.removeItem("attendanceZero");
  localStorage.removeItem("attendancePower");
  localStorage.removeItem("attendanceList");
}

// Load saved counts when the page opens
count = getStoredNumber("attendanceTotal");
waterCountElement.textContent = getStoredNumber("attendanceWater");
zeroCountElement.textContent = getStoredNumber("attendanceZero");
powerCountElement.textContent = getStoredNumber("attendancePower");
attendeeCount.textContent = count;

attendees = getStoredAttendees();
renderAttendeeList();

// Set the progress bar based on saved attendance
const startingPercentage = Math.round((count / maxCount) * 100) + "%";
progressBar.style.width = startingPercentage;

// Figure out which team is currently winning
function getWinningTeamName() {
  // Read the current count for each team from the page
  const waterCount = parseInt(
    document.getElementById("waterCount").textContent,
  );
  const zeroCount = parseInt(document.getElementById("zeroCount").textContent);
  const powerCount = parseInt(
    document.getElementById("powerCount").textContent,
  );

  const teams = [
    { name: "Team Water Wise", count: waterCount },
    { name: "Team Net Zero", count: zeroCount },
    { name: "Team Renewables", count: powerCount },
  ];

  // Sort teams from highest count to lowest count
  teams.sort(function (a, b) {
    return b.count - a.count;
  });

  // Find the highest team score
  const topCount = teams[0].count;

  // Keep all teams that match the highest score (handles ties)
  const winners = teams.filter(function (team) {
    return team.count === topCount;
  });

  // Return winner text for one winner, two-way tie, or three-way tie
  if (winners.length === 1) {
    return winners[0].name;
  } else if (winners.length === 2) {
    return `${winners[0].name} and ${winners[1].name}`;
  } else {
    return "All teams are tied!";
  }
}

// Handle from submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form from submitting normally

  // Get values entered by the user
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.options[teamSelect.selectedIndex].text;

  console.log(`Attendee Name: ${name}, Team: ${team}`);

  // Increment count
  count++;
  console.log(`Current Count: ${count}`);

  // Updat progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Current Percentage: ${percentage}`);

  // Update selected team counter
  const teamCounter = document.getElementById(team + "Count");
  const current = parseInt(teamCounter.textContent);
  console.log(`Prevous ${teamName} Count: ${current}`);

  const newTotal = current + 1;
  teamCounter.textContent = newTotal;
  console.log(`New ${teamName} Count: ${newTotal}`);

  // Add this attendee to the list shown on the page
  attendees.push({ name: name, team: teamName });
  renderAttendeeList();

  // Show welcome message or celebration message
  const message = `Welcome ${name}! You have checked in for ${teamName}.`;
  console.log(message);

  // When we hit the attendance goal, celebrate the winning team
  if (count === maxCount) {
    const winningTeamName = getWinningTeamName();
    const celebrationMessage = `🎉 Goal reached! Congratulations, ${winningTeamName}!`;
    greeting.textContent = celebrationMessage;
    console.log(celebrationMessage);
  } else {
    greeting.textContent = message;
  }

  greeting.className = "success-message";
  greeting.style.display = "block";

  // Update attendance number shown in the header
  attendeeCount.textContent = count;

  // Update progress bar width in the UI
  progressBar.style.width = percentage;

  // Save updated totals so they persist after refresh
  saveCountsToStorage();
  saveAttendeesToStorage();

  // Reset form
  form.reset();
});

resetButton.addEventListener("click", function () {
  resetAllData();
});
