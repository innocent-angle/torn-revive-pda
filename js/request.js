export function getMembers(contract, key, toCheck) {
	const request = `https://api.torn.com/faction/${contract.id}?selections=&key=${key}`;
	fetch(request)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			for (const member in data.members) {
				if (Object.hasOwnProperty.call(data.members, member)) {
					const element = data.members[member];

					if (element.status.state == "Hospital") {
						if (element.status.description.startsWith("In hospital")) {
							toCheck.push([member, contract]);
						}
					}
				}
			}
		});

	return toCheck;
}

export function checkIfRevivable(pair, key) {
	const request = `https://api.torn.com/user/${pair[0]}?selections=&key=${key}`;
	fetch(request)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);

			if (data.revivable == 1) {
				if (!pair[1].options[0] && data.last_action.status == "Online") return;
				if (!pair[1].options[1] && data.last_action.status == "Idle") return;
				if (!pair[1].options[2] && data.last_action.status == "Offline") return;

				var row = reviveTable.insertRow(1);

				var cell0 = row.insertCell(0);
				var cell1 = row.insertCell(1);
				var cell2 = row.insertCell(2);

				cell0.innerHTML = `<a href="https://www.torn.com/profiles.php?XID=${pair[0]}" target="_blank">${data.name} [${data.player_id}]</a>`;
				cell1.innerHTML = `<a href="https://www.torn.com/factions.php?step=profile&ID=${data.faction.faction_id}#/" target="_blank">${data.faction.faction_name}</a>`;
				cell2.innerHTML = data.status.description;
			}
		});
}
