import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import AddPatientDialog from './AddPatientDialog';

const useStyles = makeStyles((theme) => ({
	button: {
		borderRadius: '5em',
		background: '#4264d0',
		textTransform: 'none',
	},
}));


const PatientHeader = ({ drizzle, drizzleState }) => {
	const classes = useStyles();
	
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<React.Fragment>
			<Grid container justify="space-between">
				<Grid item>
					<Typography variant="h5" gutterBottom>
						Patient List
					</Typography>
				</Grid>
				<Grid item>
					<Button
						className={classes.button}
						variant="contained"
						color="primary"
						startIcon={<AddIcon/>}
						onClick={handleClickOpen}
					>
						Add Patient
					</Button>
				</Grid>
			</Grid>
			<AddPatientDialog drizzle={drizzle} drizzleState={drizzleState} open={open} handleClose={handleClose} />
		</React.Fragment>
	)
}

export default PatientHeader
