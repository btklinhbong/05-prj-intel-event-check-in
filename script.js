// Get all nedded DOM elements
const form = document.getElementById('checkInForm');
const nameInput = document.getElementById('attendeeName');
const teamSelect = document.getElementById('teamSelect');
const greeting = document.getElementById('greeting');

// Track attendance
let count = 0;
const maxCount = 50;

// Handle from submission
form.addEventListener("submit", function(event) {
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


  // Show welcome message
  const message = "Welcome " + name + "! You have checked in for " + teamName + ".";
  console.log(message);
  greeting.textContent = message;
  greeting.className = "success-message";
  greeting.style.display = "block";

  // Track and update the total number of attendees
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = count;
  // Reset form
  form.reset();
});