import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@material-ui/core';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import { OpenInNew as OpenInNewIcon } from '@material-ui/icons';
import PatientHeader from './PatientHeader';

import {
	Switch,
	Link,
	Route,
	useRouteMatch,
} from "react-router-dom";
import PatientInfo from './PatientInfo';


function Patients({ drizzle, drizzleState, patientCount }) {
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
				<PatientTable patientCount={patientCount} />
			</Route>
			<Route exact path={`${match.path}/${selectedPatient.id}`}>
				<PatientInfo patientID={selectedPatient.id} patientName={selectedPatient.name} drizzle={drizzle} drizzleState={drizzleState} />
			</Route>
		</Switch>
	);

	function PatientTable({ patientCount }) {
		const [patients, setPatients] = useState([]);

		useEffect(() => {
			const contract = drizzle.contracts.PatientRecord;

			let patientList = [];

			if (patientCount) {
				for (let i = 1;i <= patientCount;i++) {
					const dataKey = contract.methods["getPatient"].cacheCall(i)
					const storedData = PatientRecord.getPatient[dataKey];
					const patient = (storedData && storedData.value);
					if (patient) {
						const { 0: patientID, 1: patientJSON } = patient;
						const patientObject = JSON.parse(patientJSON);

						patientList.push({
							id: patientID,
							name: patientObject.name,
							medicare: patientObject.medicare,
						});
						setPatients(patientList);
					}
				}
			}

		}, [patientCount, drizzle.contracts.PatientRecord]);

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
			{
				field: "",
				headerName: "Action",
				disableClickEventBubbling: true,
				disableColumnMenu: true,
				sortable: false,
				renderCell: (params) => {
					const handleClick = () => {
						const api = params.api;
						const fields = api
							.getAllColumns()
							.map((c) => c.field)
							.filter((c) => c !== "__check__" && !!c);

						const thisRow = {};

						fields.forEach((item) => {
							thisRow[item] = params.row[item] || '';
						})

						setSelectedPatient(thisRow);
					}
					return (
						<div>
							<Link to={`${match.path}/${params.row.id}`}>
								<Tooltip title="Open" placement="left">
									<IconButton aria-label="open patient" component="span" onClick={handleClick}>
										<OpenInNewIcon />
									</IconButton>
								</Tooltip >
							</Link>
						</div>
					);
				}
			},
		];

		return (
			<Box pt={4}>
				<div style={{ height: 400, width: '100%' }}>
					{patients.length !== 0
						? <DataGrid
							components={{
								Toolbar: GridToolbar,
							}}
							style={{
								width: '640px'
							}}
							rows={patients}
							columns={columns}
							pageSize={5}
							checkboxSelection
							disableSelectionOnClick
						/> : null}
				</div>
			</Box>
		)
	}
}

export default Patients
