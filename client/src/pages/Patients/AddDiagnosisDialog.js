import React, { useState } from 'react';
import { useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';


const AddDiagnosisDialog = ({ drizzle, drizzleState, patientID, open, handleClose }) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
		// handleClose();
		const contract = drizzle.contracts.PatientRecord;

		const title = state.title;
		const content = state.content;

		const stackId = contract.methods["createRecord"].cacheSend(patientID, title, content, {
			from: drizzleState.accounts[0], gas: 3000000
		});

		setStackID(stackId);
	}

	function getTxStatus() {
		const { transactions, transactionStack } = drizzleState

		const txHash = transactionStack[stackId]

		if (!txHash) return null;

		return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`
	}

	return (
		<Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
			<DialogTitle>Add Diagnosis</DialogTitle>
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

export default AddDiagnosisDialog
