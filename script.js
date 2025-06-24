let players = [];

// Function to add a new player
function addPlayer() {
  const nameInput = document.getElementById("playerName");
  const name = nameInput.value.trim();

  if (name === "") {
    alert("Please enter a player name.");
    return;
  }

  // Check if player already exists
  if (players.some(player => player.name === name)) {
    alert("Player already exists.");
    return;
  }

  // Add new player with additional stats
  players.push({
    name: name,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    matchesPlayed: 0,
    gamesWon: 0,
    gamesDrawn: 0,
    gamesLost: 0,
    goalDifference: 0
  });

  nameInput.value = ""; // Clear input
  updatePlayerDropdown();
  updateScoreboard();
}

// Function to update dropdown list of players
function updatePlayerDropdown() {
  const select = document.getElementById("selectedPlayer");
  select.innerHTML = ""; // Clear existing options

  players.forEach(player => {
    const option = document.createElement("option");
    option.value = player.name;
    option.textContent = player.name;
    select.appendChild(option);
  });
}

// Function to record a result and update points, goal difference, etc.
function recordResult() {
  const playerName = document.getElementById("selectedPlayer").value;
  const result = document.getElementById("matchResult").value;

  // Prompt user for goals scored and conceded
  const goalsFor = parseInt(prompt("Enter goals scored by " + playerName + ":"));
  const goalsAgainst = parseInt(prompt("Enter goals conceded by " + playerName + ":"));

  const player = players.find(p => p.name === playerName);
  if (!player) return;

  // Update match stats
  player.matchesPlayed++;
  player.goalsFor += goalsFor;
  player.goalsAgainst += goalsAgainst;
  player.goalDifference = player.goalsFor - player.goalsAgainst;

  // Update win/loss/draw based on match result
  if (result === "win") {
    player.points += 3;
    player.gamesWon++;
  } else if (result === "draw") {
    player.points += 1;
    player.gamesDrawn++;
  } else if (result === "loss") {
    player.gamesLost++;
  }

  updateScoreboard();
}

// Function to update scoreboard table with all stats
function updateScoreboard() {
  const tableBody = document.querySelector("#scoreboard tbody");
  tableBody.innerHTML = ""; // Clear old rows

  players.forEach(player => {
    const row = document.createElement("tr");

    // Create cells for player stats
    const nameCell = document.createElement("td");
    const pointsCell = document.createElement("td");
    const matchesPlayedCell = document.createElement("td");
    const gamesWonCell = document.createElement("td");
    const gamesDrawnCell = document.createElement("td");
    const gamesLostCell = document.createElement("td");
    const goalsForCell = document.createElement("td");
    const goalsAgainstCell = document.createElement("td");
    const goalDifferenceCell = document.createElement("td");

    // Populate the cells with player data
    nameCell.textContent = player.name;
    pointsCell.textContent = player.points;
    matchesPlayedCell.textContent = player.matchesPlayed;
    gamesWonCell.textContent = player.gamesWon;
    gamesDrawnCell.textContent = player.gamesDrawn;
    gamesLostCell.textContent = player.gamesLost;
    goalsForCell.textContent = player.goalsFor;
    goalsAgainstCell.textContent = player.goalsAgainst;
    goalDifferenceCell.textContent = player.goalDifference;

    // Append the cells to the row
    row.appendChild(nameCell);
    row.appendChild(pointsCell);
    row.appendChild(matchesPlayedCell);
    row.appendChild(gamesWonCell);
    row.appendChild(gamesDrawnCell);
    row.appendChild(gamesLostCell);
    row.appendChild(goalsForCell);
    row.appendChild(goalsAgainstCell);
    row.appendChild(goalDifferenceCell);

    // Add the row to the table
    tableBody.appendChild(row);
  });
}
