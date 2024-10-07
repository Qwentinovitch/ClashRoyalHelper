const axios = require('axios');

// Replace with your own API key
const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjIyYjFkMTJiLTYwNmQtNGQ1OC1hZTZjLWM2NGEwMDViNmYyNCIsImlhdCI6MTcyNzcyOTgyNywic3ViIjoiZGV2ZWxvcGVyLzkwMjI5NGI4LTk2MmMtNjhhNC0xODg0LTFmMTFjNWYwMzc5OSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI4My4yMDQuODYuMjQiXSwidHlwZSI6ImNsaWVudCJ9XX0.hQYa4r9yNhsecPMJooqhC9McUbPlhu7EKtBpF47IesHjyK4z0dtYaDRxUmK36ptJeqWUicolQVYhcs9fYSjaWA';
const CLAN_TAG = '#Q09R8LYR'; // e.g., '#123456';

const fetchClanPlayers = async () => {
    try {
        // Fetch clan details
        const clanResponse = await axios.get(`https://api.clashroyale.com/v1/clans/${encodeURIComponent(CLAN_TAG)}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        const clanMembers = clanResponse.data.memberList;

        // Fetch river race log
        const riverRaceResponse = await axios.get(`https://api.clashroyale.com/v1/clans/${encodeURIComponent(CLAN_TAG)}/riverracelog?limit=1`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        const currentRiverRaceResponse = await axios.get(`https://api.clashroyale.com/v1/clans/${encodeURIComponent(CLAN_TAG)}/currentriverrace`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        console.log("Players with less than 600 points:")

        const currentParticipants = currentRiverRaceResponse.data.clan.participants;
        const currentWarPlayersBelow600 = clanMembers.filter(member => {
            const playerRiverRaceStats = currentParticipants.find(log => log.tag === member.tag);
            return playerRiverRaceStats && playerRiverRaceStats.fame < 600;
        });
        console.log("\n\r")
        console.log("Current River Race: ",currentWarPlayersBelow600.length,"\r\n");
        currentWarPlayersBelow600.forEach(player => {
            console.log(`${player.role} - ${player.name} (${player.trophies} trophies)`);
        });

        const riverRaceLog = riverRaceResponse.data.items[0];
        const clanRiverRaceStats = riverRaceLog.standings.find(clanTag => clanTag.clan.tag === CLAN_TAG);

        const playersBelow600 = clanMembers.filter(member => {
            const playerRiverRaceStats = clanRiverRaceStats.clan.participants.find(log => log.tag === member.tag);
            return playerRiverRaceStats && playerRiverRaceStats.fame < 600;
        });

        // console.log(playersBelow600)
        console.log("\n\r----------------------------------")
        console.log("Past River Race:",playersBelow600.length,"\r\n");
        playersBelow600.forEach(player => {
            console.log(`${player.role} - ${player.name} (${player.trophies} trophies)`);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

fetchClanPlayers();
