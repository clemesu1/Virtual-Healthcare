import React, { useState } from 'react';
import { Grid, Typography, Tooltip, IconButton } from '@material-ui/core';
import { NoteAdd as NoteAddIcon } from '@material-ui/icons';
import AddDiagnosisDialog from './AddDiagnosisDialog';
import DiagnosisList from './DiagnosisList';

const DiagnosisInfo = ({ patientID, drizzle, drizzleState }) => {
	const [open, setOpen] = useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<>
			<Grid container justify="space-between">
				<Grid item>
					<Typography component="h2" variant="h6" gutterBottom>
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
			<DiagnosisList drizzle={drizzle} drizzleState={drizzleState} patientID={patientID} />
			<AddDiagnosisDialog drizzle={drizzle} drizzleState={drizzleState} patientID={patientID} open={open} handleClose={handleClose} />
		</>
	)
}

export default DiagnosisInfo
