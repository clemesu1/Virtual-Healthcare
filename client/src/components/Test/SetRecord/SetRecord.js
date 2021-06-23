import React, { useState, useEffect } from 'react';
import {
	Container, CssBaseline, Typography, Select, MenuItem, FormControl, InputLabel, Button,
	Card, CardContent, TextField,
	Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function SetRecord({ drizzle, drizzleState }) {
	const [dataKey, setDataKey] = useState(null);
	const [patientID, setPatientID] = useState('');
	const [showSection, setShowSection] = useState(false);

	const { PatientRecord } = drizzleState.contracts;

	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;

		const dataKey = contract.methods["patientCount"].cacheCall();

		setDataKey(dataKey);
	}, [dataKey, drizzle.contracts.PatientRecord]);

	function handleSelectionChange(e) {
		setPatientID(e.target.value);
		setShowSection(true);
	}

	function handleSectionClose() {
		setShowSection(false);
	}

	const storedData = PatientRecord.patientCount[dataKey];
	const patientCount = (storedData && storedData.value);

	// Create a number array containing the number of patients.
	var patients = [];
	for (var i = 1;i <= patientCount;i++) {
		patients.push({ id: i })
	}

	return (
		<Container component="main">
			<CssBaseline />
			<Typography variant="h6">
				Create a Record:
			</Typography>
			<div className="patient">
				<Typography variant="body1">
					Enter a Patient ID:
				</Typography>
			</div>
			<div className="patient">
				<FormControl variant="outlined">
					<InputLabel id="select-label">ID</InputLabel>
					<Select
						labelId="select-label"
						value={patientID}
						onChange={handleSelectionChange}
						label="ID"
					>
						{patients.map(({ id }, index) => (
							<MenuItem key={index} value={id}>
								{id}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>

			{showSection ? <Section patientID={patientID} drizzle={drizzle} drizzleState={drizzleState} /> : null}
			<div className="patient">
				{showSection ? <Button variant="contained" onClick={handleSectionClose}>Close</Button> : null}

			</div>

		</Container>
	);
}

const useStyles = makeStyles({
	root: {
		minWidth: 275,
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
});


function Section({ patientID, drizzle, drizzleState }) {
	const classes = useStyles();
	const [stackId, setStackID] = useState(null);
	const [state, setState] = useState({
		title: "",
		content: ""
	});
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		if (!state.title || !state.content) {
			alert("Error: Fields must be filled");
			return;
		}
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	function handleChange(e) {
		setState({
			...state,
			[e.target.name]: e.target.value
		});
	}

	function handleSubmit() {
		setOpen(false);

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
		<Card width={1 / 4} className={classes.root} variant="outlined">
			<CardContent>
				<Typography variant="h6" className={classes.title} gutterBottom>
					Create a Record for Patient ID: {patientID}
				</Typography>
				<div className="record-section">
					<form onSubmit={handleClickOpen} autoComplete="off" noValidate>
						<div className="patient">
							<TextField
								label="Enter Title"
								name="title"
								value={state.title}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="patient">
							<TextField
								label="Enter Content"
								name="content"
								multiline
								rows={4}
								value={state.content}
								onChange={handleChange}
								variant="outlined"
								required
							/>
						</div>
						<div className="patient">

							<Button variant="contained" color="primary" onClick={handleClickOpen}>Submit</Button>
						</div>
					</form>
					<div className="patient">{getTxStatus()}</div>
				</div>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{"Are you sure you want to submit?"}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							Clicking the submit button means you are ready to send the entered data to the blockchain.
							After this point it will not be able to be edited or deleted.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="primary">
							Cancel
						</Button>
						<Button onClick={handleSubmit} color="primary" autoFocus>
							Submit
						</Button>
					</DialogActions>

				</Dialog>

			</CardContent>
		</Card>
	);
}


export default SetRecord;

