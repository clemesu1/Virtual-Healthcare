import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column',
	},
	fixedHeight: {
		height: 240,
	},
}));


export default function Home({ drizzle, drizzleState, patientCount }) {
	const classes = useStyles();
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

	return (
		<div>

			<Grid container spacing={3}>
				{/* Welcome message */}
				<Grid item xs={12}>
					<Typography variant="h3">
						Welcome to Blockchain Virtual Healthcare!
					</Typography>
				</Grid>
				{/* Patient Count */}
				<Grid item xs={12} sm={2}>
					<Paper className={fixedHeightPaper}>
						<Typography variant="h6">
							Patient Count: {patientCount}
						</Typography>
					</Paper>
				</Grid>

			</Grid>
		</div>
	)
}
