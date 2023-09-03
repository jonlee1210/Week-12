$(document).ready(function () {
    function addTeam() {
        const teamName = $('#new-team-name').val();

        if (teamName.trim() === '') {
            alert('Team name cannot be empty');
            return;
        }

        const newTeam = {
            name: teamName
        };

        $.ajax({
            url: 'http://localhost:3000/teams',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newTeam),
            success: function (response) {
                $('#new-team-name').val('');
                getAllTeams();
            },
            error: function (error) {
                console.error('Error creating team:', error);
            }
        });
    }

    function getAllTeams() {
        $.ajax({
            url: 'http://localhost:3000/teams',
            type: 'GET',
            success: function (teams) {
                renderTeams(teams);
            },
            error: function (error) {
                console.error('Error getting teams:', error);
            }
        });
    }

    function renderTeams(teams) {
        const appDiv = $('#app');
        appDiv.empty();

        teams.forEach(function (team) {
            const teamDiv = $('<div class="card team-card">');
            teamDiv.append('<h2>' + team.name + '</h2>');

            const deleteTeamButton = $('<button class="btn btn-danger">Delete Team</button>');
            deleteTeamButton.on('click', function () {
                deleteTeam(team.id);
            });

            const addPlayerButton = $('<button class="btn btn-primary">Add Player</button>');
            addPlayerButton.on('click', function () {
                addPlayer(team.id, teamDiv);
            });

            const playersDiv = $('<div id="players-' + team.id + '">');
            teamDiv.append(deleteTeamButton);
            teamDiv.append(addPlayerButton);
            teamDiv.append(playersDiv);

            getTeamPlayers(team.id, playersDiv);

            appDiv.append(teamDiv);
        });
    }

    function addPlayer(teamId, teamDiv) {
        const playerName = prompt('Enter Player Name:');
        const playerPosition = prompt('Enter Player Position:');

        if (playerName.trim() === '' || playerPosition.trim() === '') {
            alert('Player name and position cannot be empty');
            return;
        }

        const newPlayer = {
            name: playerName,
            position: playerPosition,
            teamId: teamId
        };

        $.ajax({
            url: 'http://localhost:3000/players',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newPlayer),
            success: function (response) {
                getTeamPlayers(teamId, teamDiv.find('#players-' + teamId));
            },
            error: function (error) {
                console.error('Error creating player:', error);
            }
        });
    }

    function getTeamPlayers(teamId, playersDiv) {
        $.ajax({
            url: 'http://localhost:3000/players?teamId=' + teamId,
            type: 'GET',
            success: function (players) {
                renderPlayers(players, teamId, playersDiv);
            },
            error: function (error) {
                console.error('Error getting players:', error);
            }
        });
    }

    function renderPlayers(players, teamId, playersDiv) {
        playersDiv.empty();

        players.forEach(function (player) {
            const playerDiv = $('<div class="card">');
            playerDiv.append('<h3>' + player.name + '</h3>');
            playerDiv.append('<p>Position: ' + player.position + '</p>');

            const deletePlayerButton = $('<button class="btn btn-danger">Delete Player</button>');
            deletePlayerButton.on('click', function () {
                deletePlayer(player.id, teamId, playersDiv);
            });

            playerDiv.append(deletePlayerButton);
            playersDiv.append(playerDiv);
        });
    }

    function deleteTeam(teamId) {
        $.ajax({
            url: 'http://localhost:3000/teams/' + teamId,
            type: 'DELETE',
            success: function (response) {
                getAllTeams();
            },
            error: function (error) {
                console.error('Error deleting team:', error);
            }
        });
    }

    function deletePlayer(playerId, teamId, playersDiv) {
        $.ajax({
            url: 'http://localhost:3000/players/' + playerId,
            type: 'DELETE',
            success: function (response) {
                getTeamPlayers(teamId, playersDiv);
            },
            error: function (error) {
                console.error('Error deleting player:', error);
            }
        });
    }

    $('#create-team').on('click', function () {
        addTeam();
    });

    getAllTeams();
});
