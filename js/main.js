import StatusHandler from "./status.js";

let toCheck = [];
let factionIDs = [];
let timeouts = [];
let checkNum = 0;
let facNum = 0;

var table = document.getElementById("reviveTable");

const statusHandler = new StatusHandler();

function getMembers(id, key) {
	facNum--;
	statusHandler.currently(id, "faction", facNum);

	const request = `https://api.torn.com/faction/${id}?selections=&key=${key}`;
	fetch(request)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			for (const member in data.members) {
				if (Object.hasOwnProperty.call(data.members, member)) {
					const element = data.members[member];

					if (element.status.state == "Hospital") {
						if (element.status.description.startsWith("In hospital")) {
							checkNum++;
							toCheck.push(member);
						}
					}
				}
			}
		});
}

function checkIfRevivable(id, key) {
	checkNum--;
	statusHandler.currently(id, "user", checkNum);

	const request = `https://api.torn.com/user/${id}?selections=&key=${key}`;
	fetch(request)
		.then((response) => response.json())
		.then((data) => {
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
		});
}

function checkAllFactions(key, delay) {
	factionIDs = document.getElementById("factionBox").value.split(/[, ]+/);
	factionIDs.forEach((id, i) => {
		facNum++;
		timeouts.push(setTimeout(getMembers, i * delay, id, key));
	});
}

function checkAllMembers(key, delay) {
	timeouts.push(
		setTimeout(() => {
			console.log(toCheck);
			toCheck.forEach((id, i) => timeouts.push(setTimeout(checkIfRevivable, i * delay, id, key)));

			timeouts.push(
				setTimeout(() => {
					statusHandler.finished();
				}, (factionIDs.length + toCheck.length) * delay),
			);
		}, factionIDs.length * delay),
	);
}

function clear() {
	toCheck = [];
	table.innerHTML = "<tr><th>Member</th><th>Faction</th><th>Status</th></tr>";
}

function start() {
	statusHandler.running();

	checkNum = 0;
	facNum = 0;

	const key = window.localStorage.getItem("apiKey");
	let delay = window.localStorage.getItem("delay");
	if (delay === null || delay === 0) delay = 1500;

	clear();
	checkAllFactions(key, delay);
	checkAllMembers(key, delay);
}

function stop() {
	timeouts.forEach((element) => {
		statusHandler.stopped();
		clearTimeout(element);
	});
}

document.getElementById("apiKey").onchange = function () {
	window.localStorage.setItem("apiKey", document.getElementById("apiKey").value);
};

document.getElementById("factionBox").onchange = function () {
	window.localStorage.setItem("factionIDs", document.getElementById("factionBox").value);
};

document.getElementById("delayBox").onchange = function () {
	window.localStorage.setItem("delay", document.getElementById("delayBox").value);
};

document.getElementById("delayCheckBox").onchange = function () {
	document.getElementById("delayBox").disabled = !document.getElementById("delayCheckBox").checked;
};

document.getElementById("startButton").addEventListener("click", start);
document.getElementById("stopButton").addEventListener("click", stop);
document.getElementById("clearButton").addEventListener("click", clear);

if (window.localStorage.getItem("apiKey")) document.getElementById("apiKey").value = window.localStorage.getItem("apiKey");
if (window.localStorage.getItem("factionIDs")) document.getElementById("factionBox").value = window.localStorage.getItem("factionIDs");
if (window.localStorage.getItem("delay")) document.getElementById("delayBox").value = window.localStorage.getItem("delay");
