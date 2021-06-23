import React, { useState } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';

function ReadRecord({ drizzle, drizzleState }) {
	const [dataKey, setDataKey] = useState(null);
	const [state, setState] = useState({
		patientID: "",
		recordID: ""
	})
	const { PatientRecord } = drizzleState.contracts;

	function handleChange(e) {
		setState({
			...state,
			[e.target.name]: e.target.value
		});
	}

	function handleSubmit(e) {
		setValue(state.patientID, state.recordID);
	}

	function setValue(patientID, recordID) {
		const contract = drizzle.contracts.PatientRecord;
		const dataKey = contract.methods["getRecord"].cacheCall(parseInt(patientID), parseInt(recordID))
		setDataKey(dataKey);
	}

	function getResults() {
		const record = PatientRecord.getRecord[dataKey];

		const recordObject = (record && record.value);

		if (!recordObject) return null;
		const { 0: recordID, 1: recordTitle, 2: recordContent } = recordObject;

		if (recordID === null || recordTitle === "") return (
			<Typography variant="body1" gutterBottom>
				Record does not exist.
			</Typography>
		);

		// otherwise, return the transaction status
		return (
			<div>
				<Typography variant="body1" gutterBottom>
					Record ID: {recordID}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Record Title: {recordTitle}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Record Content: {recordContent}
				</Typography>
			</div>
		);
	}


	return (
		<div>
			<div>
				<Typography variant="h6" gutterBottom>
					Search for Record by ID:
				</Typography>
				<div className="patient">
					<div className="patient-side">
						<TextField
							style={{ width: '150px' }}
							type="number"
							variant="outlined"
							name="patientID"
							label="Enter Patient ID"
							value={state.patientID}
							onChange={handleChange}
							className="patient-input"
						/>
					</div>
					<div className="patient-side">
						<TextField
							style={{ width: '150px' }}
							type="number"
							variant="outlined"
							name="recordID"
							label="Enter Record ID"
							value={state.recordID}
							onChange={handleChange}
							className="patient-input"
						/>
					</div>
				</div>
				<div className="patient">
					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
					>
						Submit
					</Button>
				</div>
			</div>
			<div>{getResults()}</div>
		</div>
	)
}

export default ReadRecord
