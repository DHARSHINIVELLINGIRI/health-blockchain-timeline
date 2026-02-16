export const contractAddress = "0x760f33B4f0eA6109ed706a2449902E43C2a639a0";

export const contractABI = [
	{
		"inputs": [
			{ "internalType": "address", "name": "_patient", "type": "address" },
			{ "internalType": "string", "name": "_ipfsHash", "type": "string" },
			{ "internalType": "string", "name": "_diagnosis", "type": "string" }
		],
		"name": "addRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [ { "internalType": "address", "name": "_patient", "type": "address" } ],
		"name": "getRecords",
		"outputs": [
			{
				"components": [
					{ "internalType": "string", "name": "ipfsHash", "type": "string" },
					{ "internalType": "string", "name": "diagnosis", "type": "string" },
					{ "internalType": "string", "name": "doctorId", "type": "string" },
					{ "internalType": "uint256", "name": "timestamp", "type": "uint256" }
				],
				"internalType": "struct HealthRecord.Record[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];