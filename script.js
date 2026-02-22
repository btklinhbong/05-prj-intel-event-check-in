// Get all nedded DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const maxCountDisplay = document.getElementById("maxCountDisplay");

// Track attendance
let count = 0;
const maxCount = 3;

// Show max attendance goal in the UI
maxCountDisplay.textContent = maxCount;

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

  teams.sort(function (a, b) {
    return b.count - a.count;
  });

  // Find the highest team score
  const topCount = teams[0].count;

  // Keep all teams that match the highest score (handles ties)
  const winners = teams.filter(function (team) {
    return team.count === topCount;
  });

  if (winners.length === 1) {
    return winners[0].name;
  }

  return `${winners[0].name} and ${winners[1].name}`;
}

// Handle from submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form from submitting normally

  // Get form values
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

  //Update team counter
  const teamCounter = document.getElementById(team + "Count");
  const current = parseInt(teamCounter.textContent);
  console.log(`Prevous ${teamName} Count: ${current}`);

  const newTotal = current + 1;
  teamCounter.textContent = newTotal;
  console.log(`New ${teamName} Count: ${newTotal}`);

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

  // Track and update the total number of attendees
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = count;

  // Progress Bar Update
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;

  // Reset form
  form.reset();
});
