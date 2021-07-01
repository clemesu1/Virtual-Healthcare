import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography, Button, IconButton, Tooltip } from '@material-ui/core';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {
	Switch,
	Link,
	Route,
	useRouteMatch,
} from "react-router-dom";

import AddPatient from './AddPatient';
import PatientPage from './PatientPage';


const useStyles = makeStyles((theme) => ({
	button: {
		borderRadius: '5em',
		background: '#4264d0',
		textTransform: 'none',
	},
}));


function Patients({ drizzle, drizzleState, patientCount }) {
	let match = useRouteMatch();
	const classes = useStyles();
	const { PatientRecord } = drizzleState.contracts;

	const [open, setOpen] = React.useState(false);
	const [selectedPatient, setSelectedPatient] = useState({
		id: '',
		name: '',
		medicare: '',
	});

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<React.Fragment>
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
					<PatientTable patientCount={patientCount} />
					<AddPatient open={open} handleClose={handleClose} drizzle={drizzle} drizzleState={drizzleState} />
				</Route>
				<Route exact path={`${match.path}/${selectedPatient.id}`}>
					<PatientPage id={selectedPatient.id} name={selectedPatient.name} drizzle={drizzle} drizzleState={drizzleState} />
				</Route>

			</Switch>
		</React.Fragment>
	)

	function PatientTable({ patientCount }) {
		const [patients, setPatients] = useState([]);

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

			let patientList = [];

			if (patientCount > 0) {
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

		}, [patientCount]);

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
