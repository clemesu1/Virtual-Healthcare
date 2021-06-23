import React, { useState } from 'react'
import { Typography, TextField, Button } from '@material-ui/core';

function SetPatient({ drizzle, drizzleState }) {
	const [stackId, setStackID] = useState(null);
	const [state, setState] = useState({
		name: "",
		medicare: ""
	});

	function handleChange(e) {
		setState({
			...state,
			[e.target.name]: e.target.value
		});
	}

	function handleSubmit() {
		const name = state.name;
		const medicare = state.medicare;

		const contract = drizzle.contracts.PatientRecord;

		// let drizzle know we want to call the `createPatient` method with `name` and `medicare`
		const stackId = contract.methods["createPatient"].cacheSend(name, medicare, {
			from: drizzleState.accounts[0], gas: 3000000
		});

		// save the `stackId` for later reference
		setStackID(stackId);
	}

	function getTxStatus() {
		// get the transaction states from the drizzle state
		const { transactions, transactionStack } = drizzleState

		// get the transaction hash using our saved `stackId`
		const txHash = transactionStack[stackId]

		// if transaction hash does not exist, don't display anything
		if (!txHash) return null;

		// otherwise, return the transaction status
		return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`
	}

	return (
		<div>
			<Typography variant="h6">
				Create a Patient:
			</Typography>
			<div>
				<div className="patient">
					<TextField
						variant="outlined"
						name="name"
						label="Enter your Name"
						value={state.name}
						onChange={handleChange}
					/>
				</div>
				<div className="patient">
					<TextField
						variant="outlined"
						name="medicare"
						label="Enter your Medicare Number"
						value={state.medicare}
						onChange={handleChange}
						className="patient-input"
					/>
				</div>
				<div className="patient">
					<Button variant="contained" color="primary" onClick={handleSubmit}>
						Submit
					</Button>
				</div>
			</div>
			<div>{getTxStatus()}</div>
		</div>
	);
}

export default SetPatient;
