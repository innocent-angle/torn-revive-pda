import { updateContracts, returnContract } from "./contract.js";
import { getMembers, checkIfRevivable } from "./request.js";
import StatusHandler from "./status.js";

let toCheck = [];
let contracts = [];
let checkNum = 0;
let contractNum = 0;

let memberInterval;
let checkInterval;

const reviveTable = document.getElementById("reviveTable");
const contractTable = document.getElementById("contractTable");

const statusHandler = new StatusHandler();

function clear() {
	toCheck = [];
	reviveTable.innerHTML = "<tr><th>Member</th><th>Faction</th><th>Status</th></tr>";
}

function start() {
	if (contracts.length == 0) return statusHandler.error("You must add at least one contract.");

	statusHandler.running();
	statusHandler.clearCurrent();
	clear();

	const key = window.localStorage.getItem("apiKey");
	let delay = window.localStorage.getItem("delay");
	if (delay == null || delay == 0) delay = 1000;

	const contractQueue = contracts.slice();

	memberInterval = setInterval(() => {
		contractNum = contractQueue.length;
		statusHandler.currently(contractQueue[0].id, "faction", contractNum);
		toCheck = getMembers(contractQueue[0], key, toCheck);
		contractQueue.shift();
		contractNum--;

		if (contractQueue.length == 0) {
			clearInterval(memberInterval);

			checkInterval = setInterval(() => {
				checkNum = toCheck.length;
				statusHandler.currently(toCheck[0][0], "user", checkNum);
				checkIfRevivable(toCheck[0], key);
				toCheck.shift();

				if (toCheck.length == 0) {
					clearInterval(checkInterval);
					statusHandler.finished();
				}
			}, delay);
		}
	}, delay);
}

function stop() {
	statusHandler.stopped();
	clearInterval(memberInterval);
	clearInterval(checkInterval);
	toCheck = [];
}

document.getElementById("apiKey").onchange = function () {
	window.localStorage.setItem("apiKey", document.getElementById("apiKey").value);
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
document.getElementById("contractSubmitButton").addEventListener("click", function () {
	const contract = returnContract(this.form, contracts);
	if (!contract.name || !contract.id) return statusHandler.error("Missing faction name or ID");
	contracts.push(contract);
	window.localStorage.setItem("contracts", JSON.stringify(contracts));
	updateContracts(contracts, contractTable);
});

if (window.localStorage.getItem("apiKey")) document.getElementById("apiKey").value = window.localStorage.getItem("apiKey");
if (window.localStorage.getItem("delay")) document.getElementById("delayBox").value = window.localStorage.getItem("delay");
if (window.localStorage.getItem("contracts")) contracts = JSON.parse(window.localStorage.getItem("contracts"));

updateContracts(contracts, contractTable);
