import React, { useState } from 'react';
import { Typography, TextField } from '@material-ui/core';

function ReadPatient({ drizzle, drizzleState }) {
	const [dataKey, setDataKey] = useState(null);
	const { PatientRecord } = drizzleState.contracts;

	function handleKeyDown(e) {
		// if the enter key is pressed, set the value with the string
		if (e.keyCode === 13) {
			setValue(e.target.value);
		}
	}

	function setValue(value) {
		const contract = drizzle.contracts.PatientRecord;
		const dataKey = contract.methods["getPatient"].cacheCall(parseInt(value))
		setDataKey(dataKey);
	}

	function getResults() {
		const patient = PatientRecord.getPatient[dataKey];

		const patientObject = (patient && patient.value);

		if (!patientObject) return null;
		const { 0: patientID, 1: patientName, 2: patientMedicare } = patientObject;

		if (patientID === null || patientName === "") return (
			<Typography variant="body1" gutterBottom>
				Patient does not exist.
			</Typography>
		);

		// otherwise, return the transaction status
		return (
			<div>
				<Typography variant="body1" gutterBottom>
					Patient ID: {patientID}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Patient Name: {patientName}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Patient Medicare: {patientMedicare}
				</Typography>
			</div>
		);
	}

	return (
		<div>
			<Typography variant="h6" gutterBottom>
				Search for Patient by ID:
			</Typography>
			<TextField style={{ width: '150px' }} type="number" variant="outlined" onKeyDown={handleKeyDown} label="Enter Patient ID" />
			<div>{getResults()}</div>
		</div>
	);
}

export default ReadPatient;
