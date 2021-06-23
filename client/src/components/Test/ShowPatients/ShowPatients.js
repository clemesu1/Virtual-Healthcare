import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';

function GetPatients({ patientCount, drizzle, drizzleState }) {
	const [dataKey, setDataKey] = useState(null);
	const [patients, setPatients] = useState([]);
	// const [patient, setPatient] = useState('')
	const { PatientRecord } = drizzleState.contracts;


	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;
		var patients = [];
		for (let i = 1;i <= patientCount;i++) {
			const dataKey = contract.methods["getPatient"].cacheCall(i)
			setDataKey(dataKey);
			const storedData = PatientRecord.getPatient[dataKey];
			const patient = (storedData && storedData.value);
			if (patient) {
				const { 0: patientID, 1: patientName, 2: patientMedicare } = patient;
				patients.push({
					id: patientID,
					name: patientName,
					medicare: patientMedicare
				});
				setPatients(patients);
			}
		}
	}, [dataKey, patientCount, drizzle.contracts.PatientRecord, PatientRecord.getPatient]);

	const columns = [ 
		{
			field: 'id',
			headerName: 'ID',
			flex: 1
		},
		{
			field: 'name',
			headerName: 'Name',
			flex: 1
		},
		{
			field: 'medicare',
			headerName: 'Medicare Number',
			flex: 1
		},

	]

	return (
		<div>
			<div style={{ height: 400, width: '100%' }}>
				<DataGrid style={{width: '640px'}} rows={patients} columns={columns} pageSize={5} />
			</div>
		</div>
	)
}

function ShowPatients({ drizzle, drizzleState }) {
	const [patientCount, setPatientCount] = useState('');
	const { PatientRecord } = drizzleState.contracts;

	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;

		const dataKey = contract.methods["patientCount"].cacheCall();

		const storedData = PatientRecord.patientCount[dataKey];
		const patientCount = (storedData && storedData.value);
		setPatientCount(patientCount);

	}, [PatientRecord.patientCount, drizzle.contracts.PatientRecord]);

	return (
		<div>
			<Typography variant="h6" gutterBottom>
				Patient List:
			</Typography>
			<GetPatients patientCount={patientCount} drizzle={drizzle} drizzleState={drizzleState}
			/>
		</div>
	);
}

export default ShowPatients;
