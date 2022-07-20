import StatusHandler from "./status.js";

let toCheck = [];

var table = document.getElementById("reviveTable");

const statusHandler = new StatusHandler();

function getMembers(id, key) {
    statusHandler.currently(id, "faction")

    const request = `https://api.torn.com/faction/${id}?selections=&key=${key}`
    fetch(request)
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        for (const member in data.members) {
            if (Object.hasOwnProperty.call(data.members, member)) {
                const element = data.members[member];
                
                if (element.status.state == "Hospital") {
                    if (element.status.description.startsWith("In hospital")) {
                        toCheck.push(member);
                    }
                }
            }
        }
    })
}

function checkIfRevivable(id, key) {
    statusHandler.currently(id, "user")

    const request = `https://api.torn.com/user/${id}?selections=&key=${key}`
    fetch(request)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.revivable == 1 && data.last_action.status == "Offline") {
            var row = table.insertRow(1);

            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);

            cell0.innerHTML = `<a href="https://www.torn.com/profiles.php?XID=${id}" target="_blank">${data.name} [${data.player_id}]</a>`;
            cell1.innerHTML = `<a href="https://www.torn.com/factions.php?step=profile&ID=${data.faction.faction_id}#/" target="_blank">${data.faction.faction_name}</a>`;
            cell2.innerHTML = data.status.description;
        }
    })
}

function clear() {
    toCheck = [];
    table.innerHTML = "<tr><th>Member</th><th>Faction</th><th>Status</th></tr>";
}

function start() {
    statusHandler.running();
    clear();

    const factionIDs = document.getElementById("factionBox").value.split(", ");
    const key = window.localStorage.getItem("apiKey");
    let delay = window.localStorage.getItem("delay");
    if (delay === null || delay === 0) delay = 1500;

    factionIDs.forEach((id, i) => setTimeout(getMembers, i * delay, id, key))

    setTimeout(() => {
        console.log(toCheck)
        toCheck.forEach((id, i) => setTimeout(checkIfRevivable, i * delay, id, key))

        setTimeout(() => {
            statusHandler.finished();
        }, (factionIDs.length + toCheck.length) * delay)
    }, factionIDs.length * delay);
    

    statusHandler.running();
}

document.getElementById("apiKey").onchange = function() {
    window.localStorage.setItem('apiKey', document.getElementById("apiKey").value)
}

document.getElementById("factionBox").onchange = function() {
    window.localStorage.setItem('factionIDs', document.getElementById("factionBox").value)
}

document.getElementById("delayBox").onchange = function() {
    window.localStorage.setItem('delay', document.getElementById("delayBox").value)
}

document.getElementById("delayCheckBox").onchange = function() {
    document.getElementById("delayBox").disabled = !document.getElementById("delayCheckBox").checked;
}

document.getElementById("startButton").addEventListener("click", start);
document.getElementById("clearButton").addEventListener("click", clear);

if (window.localStorage.getItem('apiKey')) document.getElementById("apiKey").value = window.localStorage.getItem('apiKey');
if (window.localStorage.getItem('factionIDs')) document.getElementById("factionBox").value = window.localStorage.getItem('factionIDs');
if (window.localStorage.getItem('delay')) document.getElementById("delayBox").value = window.localStorage.getItem('delay');