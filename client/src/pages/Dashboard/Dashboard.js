import React, { useState, useEffect } from 'react';
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


function Dashboard({ drizzle, drizzleState }) {
	const classes = useStyles();
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
	const [dataKey, setDataKey] = useState(null);
	const { PatientRecord } = drizzleState.contracts;

	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;
		const dataKey = contract.methods["patientCount"].cacheCall();
		setDataKey(dataKey);
	}, [dataKey, drizzle.contracts.PatientRecord]);

	const storedData = PatientRecord.patientCount[dataKey];
	const patientCount = (storedData && storedData.value);
	return (
		<div>

			<Grid container spacing={3}>
				{/* Chart */}
				<Grid item xs={12}>
					<Typography variant="h3">
						Welcome to Blockchain Virtual Healthcare!
					</Typography>
				</Grid>
				{/* Recent Deposits */}
				<Grid item xs={12} sm={2}>
					<Paper className={fixedHeightPaper}>
						<Typography variant="h6">
							Patient Count: {patientCount}
						</Typography>
					</Paper>
				</Grid>
				{/* Recent Orders */}
				<Grid item xs={12} sm={2}>
					<Paper className={fixedHeightPaper}>
						<Typography variant="h6">
							Record Count:
						</Typography>
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
}

export default Dashboard
