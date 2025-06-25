const teams = {
  arsenal: { name: "Arsenal", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
  man_city: { name: "Manchester City", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" },
  man_united: { name: "Manchester United", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" },
  chelsea: { name: "Chelsea", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
  liverpool: { name: "Liverpool", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
  real_madrid: { name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" },
  barcelona: { name: "Barcelona", logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg" },
  atletico: { name: "Atletico Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg" },
  sevilla: { name: "Sevilla", logo: "https://upload.wikimedia.org/wikipedia/en/8/86/Sevilla_CF_logo.svg" },
  valencia: { name: "Valencia", logo: "https://upload.wikimedia.org/wikipedia/en/c/ce/Valencia_CF.svg" }
};

let players = [];

function loadPlayers() {
  const saved = localStorage.getItem("players");
  if (saved) players = JSON.parse(saved);
  sortAndDisplayPlayers();
  updateMatchDropdowns();
  updateDeleteDropdown();
}

function savePlayers() {
  localStorage.setItem("players", JSON.stringify(players));
}

function addPlayer() {
  const nameInput = document.getElementById("playerName");
  const teamKey = document.getElementById("teamSelect").value;
  const name = nameInput.value.trim();

  if (!name || !teamKey) return alert("Please enter player name and select team.");

  const team = teams[teamKey];

  const player = {
    name,
    team: team.name,
    logo: team.logo,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0
  };

  players.push(player);
  savePlayers();
  sortAndDisplayPlayers();
  updateMatchDropdowns();
  updateDeleteDropdown();

  nameInput.value = "";
  document.getElementById("teamSelect").value = "";
}

function sortAndDisplayPlayers() {
  players.forEach(p => {
    p.gd = p.gf - p.ga;
    p.points = p.won * 3 + p.drawn;
    p.played = p.won + p.drawn + p.lost;
  });

  players.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);

  const tbody = document.querySelector("#playersTable tbody");
  tbody.innerHTML = "";

  players.forEach((player, index) => {
    const row = tbody.insertRow();
    row.insertCell(0).textContent = index + 1;

    const clubCell = row.insertCell(1);
    clubCell.className = "club-cell";
    clubCell.innerHTML = `
      <img src="${player.logo}" class="club-logo" alt="logo">
      <span class="club-name">${player.name}</span>
    `;

    row.insertCell(2).textContent = player.played;
    row.insertCell(3).textContent = player.won;
    row.insertCell(4).textContent = player.drawn;
    row.insertCell(5).textContent = player.lost;
    row.insertCell(6).textContent = player.gf;
    row.insertCell(7).textContent = player.ga;
    row.insertCell(8).textContent = player.gd;
    row.insertCell(9).textContent = player.points;
  });

  // Show winner if all played 38
  const allPlayed38 = players.length > 0 && players.every(p => p.played >= 38);
  const winnerBanner = document.getElementById("winnerBanner");
  if (allPlayed38) {
    const winner = players[0];
    winnerBanner.innerHTML = `🏆 ${winner.name} Wins the League!`;
    winnerBanner.style.display = "block";
  } else {
    winnerBanner.style.display = "none";
  }
}

function resetTable() {
  if (confirm("Reset the table?")) {
    players = [];
    localStorage.removeItem("players");
    sortAndDisplayPlayers();
    updateMatchDropdowns();
    updateDeleteDropdown();
  }
}

function updateMatchDropdowns() {
  const teamA = document.getElementById("teamA");
  const teamB = document.getElementById("teamB");
  teamA.innerHTML = "";
  teamB.innerHTML = "";

  players.forEach((player, index) => {
    const optionA = document.createElement("option");
    optionA.value = index;
    optionA.textContent = player.name;
    const optionB = optionA.cloneNode(true);
    teamA.appendChild(optionA);
    teamB.appendChild(optionB);
  });
}

function recordMatch() {
  const aIndex = parseInt(document.getElementById("teamA").value);
  const bIndex = parseInt(document.getElementById("teamB").value);
  const scoreA = parseInt(document.getElementById("scoreA").value);
  const scoreB = parseInt(document.getElementById("scoreB").value);

  if (isNaN(scoreA) || isNaN(scoreB) || aIndex === bIndex) {
    alert("Enter valid scores and select two different teams.");
    return;
  }

  const teamA = players[aIndex];
  const teamB = players[bIndex];

  if (teamA.played >= 38 || teamB.played >= 38) {
    alert("One of the teams has already played 38 matches.");
    return;
  }

  teamA.gf += scoreA;
  teamA.ga += scoreB;
  teamB.gf += scoreB;
  teamB.ga += scoreA;

  if (scoreA > scoreB) {
    teamA.won++;
    teamB.lost++;
  } else if (scoreA < scoreB) {
    teamB.won++;
    teamA.lost++;
  } else {
    teamA.drawn++;
    teamB.drawn++;
  }

  savePlayers();
  sortAndDisplayPlayers();
  updateMatchDropdowns();
  updateDeleteDropdown();

  document.getElementById("scoreA").value = "";
  document.getElementById("scoreB").value = "";
}

function updateDeleteDropdown() {
  const deleteSelect = document.getElementById("deletePlayerSelect");
  deleteSelect.innerHTML = "";

  players.forEach((player, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = player.name;
    deleteSelect.appendChild(option);
  });
}

function deletePlayer() {
  const select = document.getElementById("deletePlayerSelect");
  const index = parseInt(select.value);

  if (isNaN(index)) {
    alert("Please select a player to delete.");
    return;
  }

  const confirmDelete = confirm(`Delete player "${players[index].name}"?`);
  if (confirmDelete) {
    players.splice(index, 1);
    savePlayers();
    sortAndDisplayPlayers();
    updateMatchDropdowns();
    updateDeleteDropdown();
  }
}

window.onload = loadPlayers;
