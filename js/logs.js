let apiKey;

const table = document.getElementById("logTable");
const tableInitialHTML = table.innerHTML;

function updateLogs() {
	const request = `https://api.torn.com/user/?selections=revives&key=${apiKey}`;
	table.innerHTML = tableInitialHTML;

	fetch(request)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			for (const i in data.revives) {
				if (Object.hasOwnProperty.call(data.revives, i)) {
					const element = data.revives[i];

					const row = table.insertRow(1);
					row.insertCell().innerHTML = `<a href="https://www.torn.com/profiles.php?XID=${element.target_id}" target="_blank">${element.target_name}</a>`;
					row.insertCell().innerHTML = `<a href="https://www.torn.com/factions.php?step=profile&ID=${element.target_faction}#/" target="_blank">${element.target_factionname}</a>`;
					row.insertCell().innerHTML = element.result;
					row.insertCell().innerHTML = element.chance;
					row.insertCell().innerHTML = new Date(element.timestamp * 1000).toUTCString();
				}
			}
		});
}

document.getElementById("fetchButton").addEventListener("click", updateLogs);

if (localStorage.getItem("apiKey")) apiKey = localStorage.getItem("apiKey");
if (apiKey) document.getElementById("apiKey").value = apiKey;
