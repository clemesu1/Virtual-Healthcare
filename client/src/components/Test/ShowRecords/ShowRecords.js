import React, { useState, useEffect } from "react";
import { Container, CssBaseline, Typography, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';

function ShowRecords({ drizzle, drizzleState }) {
	const [dataKey, setDataKey] = useState(null);
	const [patientID, setPatientID] = useState('');
	const [showSection, setShowSection] = useState(false);
	const { PatientRecord } = drizzleState.contracts;

	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;
		const dataKey = contract.methods["patientCount"].cacheCall();

		setDataKey(dataKey);
	}, [dataKey, drizzle.contracts.PatientRecord]);

	function handleChange(e) {
		setPatientID(e.target.value);
		setShowSection(true);
	}

	const storedData = PatientRecord.patientCount[dataKey];
	const patientCount = (storedData && storedData.value);

	var patients = [];
	for (var i = 1;i <= patientCount;i++) {
		patients.push({ id: i })
	}

	return (
		<Container component="main">
			<CssBaseline />

			<Typography variant="h6" gutterBottom>
				Record List:
			</Typography>

			<FormControl variant="outlined">
				<InputLabel id="select-label">ID</InputLabel>
				<Select
					labelId="select-label"
					value={patientID}
					onChange={handleChange}
					label="ID"
				>
					{patients.map(({ id }, index) => (
						<MenuItem key={index} value={id}>
							{id}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			{showSection ? <GetRecordCount patientID={patientID} drizzle={drizzle} drizzleState={drizzleState} /> : null}
		</Container >
	);
}

function GetRecordCount({ patientID, drizzle, drizzleState }) {
	const [dataKey, setDataKey] = useState(null);
	const { PatientRecord } = drizzleState.contracts;

	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;
		const dataKey = contract.methods["recordCount"].cacheCall(patientID);
		setDataKey(dataKey);
	}, [patientID, dataKey, drizzle.contracts.PatientRecord]);

	const storedData = PatientRecord.recordCount[dataKey];
	const recordCount = (storedData && storedData.value);
	return <GetRecords recordCount={recordCount} patientID={patientID} drizzle={drizzle} drizzleState={drizzleState} />

}

function GetRecords({ recordCount, patientID, drizzle, drizzleState }) {
	const [records, setRecords] = useState([]);
	const { PatientRecord } = drizzleState.contracts;

	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;
		var records = [];
		for (let i = 1;i <= recordCount;i++) {
			const dataKey = contract.methods["getRecord"].cacheCall(patientID, i)
			const storedData = PatientRecord.getRecord[dataKey];
			const record = (storedData && storedData.value);

			if (record) {
				const { 0: recordID, 1: recordTitle, 2: recordContent } = record;
				records.push({
					id: recordID,
					title: recordTitle,
					content: recordContent
				});
				setRecords(records);
			}
		}
	}, [recordCount, patientID, PatientRecord.getRecord, drizzle.contracts.PatientRecord]);

	const columns = [
		{
			field: 'id',
			headerName: 'Record ID',
			flex: 1
		},
		{
			field: 'title',
			headerName: 'Record Title',
			flex: 1
		},
		{
			field: 'content',
			headerName: 'Record Content',
			flex: 1
		},
	];

	return (
		<div style={{ height: 400, width: '100%' }}>
			<DataGrid style={{ width: '640px' }} rows={records} columns={columns} pageSize={5} />
		</div>
	)
}


export default ShowRecords;
