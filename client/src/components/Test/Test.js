import React, { useState, useEffect } from 'react';
import { Typography, Divider } from '@material-ui/core';
import ReadPatient from './ReadPatient/ReadPatient';
import ReadRecord from './ReadRecord/ReadRecord';
import SetPatient from './SetPatient/SetPatient';
import SetRecord from './SetRecord/SetRecord';
import ShowPatients from './ShowPatients/ShowPatients';
import ShowRecords from './ShowRecords/ShowRecords';
import './Test.css';

function Test({ drizzle, drizzleState }) {
	const [dataKey, setDataKey] = useState(null);
	const { PatientRecord } = drizzleState.contracts;

	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;
		const dataKey = contract.methods["patientCount"].cacheCall();
		setDataKey(dataKey);
	}, [dataKey, drizzle.contracts.PatientRecord]);

	const patientCount = PatientRecord.patientCount[dataKey];
	const id = (patientCount && patientCount.value);
	return (
		<div>
			<Typography variant="body1" gutterBottom>
				Number of patients in the blockchain: {id}
			</Typography>
			<div>
				<ReadPatient drizzle={drizzle} drizzleState={drizzleState} />
				<Divider style={{ margin: '25px 0 15px'}}/>

				<ReadRecord drizzle={drizzle} drizzleState={drizzleState} />
				<Divider style={{ margin: '25px 0 15px'}}/>

				<SetPatient drizzle={drizzle} drizzleState={drizzleState} />
				<Divider style={{ margin: '25px 0 15px'}}/>

				<SetRecord drizzle={drizzle} drizzleState={drizzleState} />
				<Divider style={{ margin: '25px 0 15px'}}/>

				<ShowPatients drizzle={drizzle} drizzleState={drizzleState} />
				<Divider style={{ margin: '25px 0 15px'}}/>

				<ShowRecords drizzle={drizzle} drizzleState={drizzleState} />

			</div>
		</div>
	)
}

export default Test
