import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip, Table, TableCell, TableRow, TableBody, TableHead } from '@material-ui/core';
import { GridToolbar } from '@material-ui/data-grid';
import { OpenInNew as OpenInNewIcon } from '@material-ui/icons';
import PatientHeader from './PatientHeader';

import {
	Switch,
	Link,
	Route,
	useRouteMatch,
} from "react-router-dom";
import PatientInfo from './PatientInfo';


function Patients({ drizzle, drizzleState }) {
	const { PatientRecord } = drizzleState.contracts;
	const match = useRouteMatch();
	const [selectedPatient, setSelectedPatient] = useState({
		id: '',
		name: '',
		medicare: '',
	});

	return (
		<Switch>
			<Route exact path={match.path}>
				<PatientHeader drizzle={drizzle} drizzleState={drizzleState} />
				<PatientTable />
			</Route>
			<Route exact path={`${match.path}/${selectedPatient.id}`}>
				<PatientInfo patientID={selectedPatient.id} patientName={selectedPatient.name} drizzle={drizzle} drizzleState={drizzleState} />
			</Route>
		</Switch>
	);

	function PatientTable() {
		// const [patients, setPatients] = useState([]);
		//
		//
		//
		//
		//
		//

		// const [patientCount, setPatientCount] = useState(0);
		const [dataKeys, setDataKeys] = useState([]);

		useEffect(() => {

			async function fetchPatients() {
				const contract = drizzle.contracts.PatientRecord;
				const patientCount = await contract.methods.patientCount().call();
				const dataKeys = []
				for (let i = 1;i <= patientCount;i++) {
					await dataKeys.push(contract.methods.getPatient.cacheCall(i));
				}

				setDataKeys(dataKeys)

			}

			fetchPatients();

		}, [])


		const patientList = dataKeys.map(key =>
			PatientRecord.getPatient[key] ? PatientRecord.getPatient[key].value : []
		);

		const handleClick = (patient) => {
			setSelectedPatient({
				id: patient[0],
				name: JSON.parse(patient[1]).name,
				medicare: JSON.parse(patient[1]).medicare,
			})
		}


		const rows = patientList.map(patient => (
			<TableRow key={patient[0]}>
				<TableCell>{patient[0]}</TableCell>
				<TableCell>
					{JSON.parse(patient[1]).name}
				</TableCell>
				<TableCell>
					{JSON.parse(patient[1]).medicare}
				</TableCell>
				<TableCell>
					<Link to={`${match.path}/${patient[0]}`}>
						<Tooltip title="Open" placement="left">
							<IconButton aria-label="open patient" component="span" onClick={() => handleClick(patient)}>
								<OpenInNewIcon />
							</IconButton>
						</Tooltip >
					</Link>
				</TableCell>

			</TableRow>
		));

		return (
			<>
				{patientList.length === 0 ? 'Loading...' :
					<Table
						components={{
							Toolbar: GridToolbar,
						}}
						pageSize={5}						
					>
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Medicare Number</TableCell>
								<TableCell>Action</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>{rows}</TableBody>
					</Table>
				}
			</>
		)


	}
}

export default Patients
