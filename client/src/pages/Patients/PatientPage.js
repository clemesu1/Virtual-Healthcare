import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Container, Typography, Breadcrumbs, Grid, Paper, Tooltip, IconButton,
	Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import {
	Link
} from "react-router-dom";
import DiagnosisList from './DiagnosisList';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		color: theme.palette.text.primary,
	},
	container: {
		padding: theme.spacing(4),
	},
}));

function PatientPage({ id, name, drizzle, drizzleState }) {
	const classes = useStyles();

	const [dataKey, setDataKey] = useState(null);
	const { PatientRecord } = drizzleState.contracts;
	const [patient, setPatient] = useState([])
	const [open, setOpen] = React.useState(false);


	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;
		const dataKey = contract.methods["getPatient"].cacheCall(parseInt(id))
		setDataKey(dataKey);
		const storedData = PatientRecord.getPatient[dataKey];
		const patient = (storedData && storedData.value);
		if (patient) {
			const { 0: patientID, 1: patientName, 2: patientMedicare } = patient;
			setPatient({
				id: patientID,
				name: patientName,
				medicare: patientMedicare
			});
		}
	}, [id, dataKey, drizzle.contracts.PatientRecord, PatientRecord.getPatient])


	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div className={classes.root}>
			<Typography variant="h4">
				{patient.name}
			</Typography>
			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
				<Link to="/patients" className="breadcrumbs-link">
					Patients
				</Link>
				<Typography color="textPrimary">
					{name}
				</Typography>
			</Breadcrumbs>

			<Container maxWidth="xl" className={classes.container}>
				<Grid container spacing={3}>
					<Grid item xs={8}>
						<Paper className={classes.paper}>
							<Typography variant="h5">
								Patient Information
							</Typography>
							<Grid container spacing={3} className={classes.container}>
								<Grid item xs>
									<Typography variant="body1">
										Full Name:
									</Typography>
									<Typography variant="body1">
										{patient.name}
									</Typography>
								</Grid>

								<Grid item xs>
									<Typography variant="body1">
										Medicare Number:
									</Typography>
									<Typography variant="body1">
										{patient.medicare}
									</Typography>
								</Grid>

							</Grid>
						</Paper>
					</Grid>
					<Grid item xs>
						<Paper className={classes.paper}>
							<Grid justify="space-between" container>
								<Grid item>
									<Typography variant="h5" gutterBottom>
										Diagnosis
									</Typography>
								</Grid>
								<Grid item>
									<Tooltip title="Create Note" placement="top">
										<IconButton aria-label="create note" component="span" onClick={handleClickOpen}>
											<NoteAddIcon />
										</IconButton>
									</Tooltip >
								</Grid>
							</Grid>
							<DiagnosisList patientID={patient.id} drizzle={drizzle} drizzleState={drizzleState} />
						</Paper>
					</Grid>
				</Grid>
			</Container>
			<AddDiagnosisDialog patientID={patient.id} open={open} handleClose={handleClose} drizzle={drizzle} drizzleState={drizzleState} />
		</div>
	);
}

function AddDiagnosisDialog({ patientID, open, handleClose, drizzle, drizzleState }) {
	const [stackId, setStackID] = useState(null);
	const [state, setState] = useState({
		title: "",
		content: ""
	});

	function handleChange(e) {
		setState({
			...state,
			[e.target.name]: e.target.value
		});
	}

	function handleSubmit() {
		handleClose();

		const title = state.title;
		const content = state.content;

		const contract = drizzle.contracts.PatientRecord;

		// let drizzle know we want to call the `createRecord` method with `title` and `content`
		const stackId = contract.methods["createRecord"].cacheSend(patientID, title, content, {
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
		<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
			<DialogTitle id="form-dialog-title">Create Diagnosis</DialogTitle>
			<DialogContent>
				<DialogContentText>
					To add a diagnosis to the system, please enter a title and the content of the diagnosis.
				</DialogContentText>
				<TextField
					name="title"
					autoFocus
					margin="dense"
					label="Diagnosis Title"
					fullWidth
					value={state.title}
					onChange={handleChange}
				/>
				<TextField
					name="content"
					margin="dense"
					label="Diagnosis Content"
					fullWidth
					value={state.content}
					onChange={handleChange}
					multiline
					variant="outlined"
					rows={6}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
				<Button onClick={handleSubmit} color="primary">
					Submit
				</Button>
			</DialogActions>
			<Typography variant="body2">
				{getTxStatus()}
			</Typography>
		</Dialog>
	)
}


export default PatientPage;