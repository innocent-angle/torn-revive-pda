const contractTableInitialHTML = document.getElementById("contractTable").innerHTML;

export class Contract {
	constructor(name, id, options, status) {
		this.name = name;
		this.id = id;
		this.options = options;
		this.status = status;
	}
}

export function updateContracts(contracts, contractTable) {
	contractTable.innerHTML = contractTableInitialHTML;

	for (let i = 0; i < contracts.length; i++) {
		const contract = contracts[i];

		var row = contractTable.insertRow(1);

		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		var cell2 = row.insertCell(2);
		var cell3 = row.insertCell(3);
		var cell4 = row.insertCell(4);

		cell0.innerHTML = `<a href="https://www.torn.com/factions.php?step=profile&ID=${contract.id}#/" target="_blank">${contract.name}</a>`;
		cell1.innerHTML = `<p>${contract.id}</p>`;
		cell2.innerHTML = `<p>${contract.options}</p>`;
		cell3.innerHTML = `<p>${contract.status}</p>`;

		const removeButton = document.createElement("button");
		removeButton.innerText = "x";
		removeButton.addEventListener("click", function () {
			const id = removeButton.parentElement.parentElement.children[1].children[0].innerText;
			contracts.forEach((contract) => {
				if (id == contract.id) {
					contracts.splice(contracts.indexOf(contract), 1);
					window.localStorage.setItem("contracts", JSON.stringify(contracts));
				}
			});

			updateContracts(contracts, contractTable);
		});

		cell4.appendChild(removeButton);
	}

	// if (contractTable.rows.length > 1) contractTable.hidden = false;
	// if (contractTable.rows.length <= 1) contractTable.hidden = true;
}

export function returnContract(form) {
	const name = form.name.value;
	const id = form.id.value;
	const opts = [form.online.checked, form.away.checked, form.offline.checked];
	const status = form.status.value;

	form.reset();
	return new Contract(name, id, opts, status);
}
