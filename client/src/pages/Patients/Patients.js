import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, IconButton, Tooltip } from '@material-ui/core';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {
	Switch,
	Link,
	Route,
	useRouteMatch,
} from "react-router-dom";
import PatientPage from './PatientPage';
import AddPatient from './AddPatient';

const useStyles = makeStyles((theme) => ({
	button: {
		borderRadius: '5em',
		background: '#4264d0',
		textTransform: 'none',
	},
}));


function Patients({ drizzle, drizzleState }) {
	const [patientCount, setPatientCount] = useState('');
	const [open, setOpen] = React.useState(false);
	const { PatientRecord } = drizzleState.contracts;
	const [selectedPatient, setSelectedPatient] = useState({
		id: '',
		name: '',
		medicare: '',
	});

	let match = useRouteMatch();


	const classes = useStyles();

	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;
		const dataKey = contract.methods["patientCount"].cacheCall();
		const patientCount = PatientRecord.patientCount[dataKey];
		setPatientCount((patientCount && patientCount.value));
	}, [PatientRecord.patientCount, drizzle.contracts.PatientRecord]);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Switch>
				<Route exact path={match.path}>
					<Grid justify="space-between" container>
						<Grid item>
							<Typography variant="h5" gutterBottom>
								Patient List
							</Typography>
						</Grid>
						<Grid item>
							<Button variant="contained" color="primary" className={classes.button} startIcon={<AddIcon />} onClick={handleClickOpen}>
								Add Patient
							</Button>
						</Grid>
					</Grid>
					<PatientTable setSelectedPatient={setSelectedPatient} patientCount={patientCount} drizzle={drizzle} drizzleState={drizzleState} />
					<AddPatient open={open} handleClose={handleClose} drizzle={drizzle} drizzleState={drizzleState} />
				</Route>
				<Route exact path={`${match.path}/${selectedPatient.id}`}>
					<PatientPage id={selectedPatient.id} name={selectedPatient.name} drizzle={drizzle} drizzleState={drizzleState} />
				</Route>

			</Switch>
		</div >
	)

}

function PatientTable({  setSelectedPatient, patientCount, drizzle, drizzleState }) {
	let match = useRouteMatch();
	const [patients, setPatients] = useState([]);

	const { PatientRecord } = drizzleState.contracts;

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

	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;
		var patients = [];
		for (let i = 1;i <= patientCount;i++) {
			const dataKey = contract.methods["getPatient"].cacheCall(i)
			const storedData = PatientRecord.getPatient[dataKey];
			const patient = (storedData && storedData.value);
			if (patient) {
				const { 0: patientID, 1: patientJSON } = patient;
				const patientObject = JSON.parse(patientJSON);

				patients.push({
					id: patientID,
					name: patientObject.name,
					medicare: patientObject.medicare,
				});
				setPatients(patients);
			}
		}
	}, [patientCount, drizzle.contracts.PatientRecord, PatientRecord.getPatient]);

	return (
		<Box pt={4}>
			<div style={{ height: 400, width: '100%' }}>
				<DataGrid
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
				/>
			</div>
		</Box>
	);
}

export default Patients;
