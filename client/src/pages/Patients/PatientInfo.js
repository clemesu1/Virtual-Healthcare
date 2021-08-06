import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Breadcrumbs, Container, Grid, Paper } from '@material-ui/core';
import { NavigateNext as NavigateNextIcon } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import DiagnosisInfo from './DiagnosisInfo';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	breadcrumbs: {
		paddingTop: theme.spacing(4)
	},
	link: {
		color: 'inherit',
		textDecoration: 'none',
		fontWeight: 'bold',
		'&:hover': {
			textDecoration: 'underline'
		}
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
		paddingLeft: theme.spacing(0),
		height: '100%'
	},
	section: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column'
	},
	fixedHeight: {
		height: 480
	},
}));

const PatientInfo = ({ patientID, patientName, drizzle, drizzleState }) => {
	const { PatientRecord } = drizzleState.contracts;
	const classes = useStyles();
	const fixedHeightPaper = clsx(classes.section, classes.fixedHeight);
	const [dataKey, setDataKey] = useState(null);
	const [patient, setPatient] = useState([])

	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;
		const dataKey = contract.methods["getPatient"].cacheCall(parseInt(patientID))
		setDataKey(dataKey);
		const storedData = PatientRecord.getPatient[dataKey];
		const patient = (storedData && storedData.value);


		if (patient) {
			const { 0: patientID, 1: patientJSON } = patient;
			const patientObject = JSON.parse(patientJSON);

			setPatient({
				id: patientID,
				email: patientObject.email,
				name: patientObject.name,
				medicare: patientObject.medicare,
				gender: patientObject.gender,
				dateOfBirth: patientObject.dateOfBirth,
				phone: patientObject.phone,
				address: patientObject.streetAddress,
				city: patientObject.city,
				province: patientObject.province,
				postalCode: patientObject.postalCode,
				country: patientObject.country

			});
		}
	}, [dataKey, drizzle.contracts.PatientRecord])

	return (
		<div className={classes.root}>
			<Typography variant="h4">
				{patientName}
			</Typography>
			<Breadcrumbs className={classes.breadcrumbs} separator={<NavigateNextIcon fontSize="small" />}>
				<Link to="/patients" className={classes.link}>Patients</Link>
				<Typography color="textPrimary">
					{patientName}
				</Typography>
			</Breadcrumbs>
			<Container className={classes.container} maxWidth="xl">
				<Grid container spacing={3}>
					<Grid item xs={7}>
						<Paper className={fixedHeightPaper}>
							<Typography component="h2" variant="h6" gutterBottom>
								Patient Information
							</Typography>
							<Grid container spacing={3} className={classes.container}>
								<Grid item xs={12} sm={6}>
									<Typography variant="subtitle1" color="textSecondary">
										Full Name
									</Typography>
									<Typography variant="body1">
										{patient.name}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="subtitle1" color="textSecondary">
										Medicare Number
									</Typography>
									<Typography variant="body1">
										{patient.medicare}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={4}>
									<Typography variant="subtitle1" color="textSecondary">
										Gender
									</Typography>
									<Typography variant="body1">
										{patient.gender}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={4}>
									<Typography variant="subtitle1" color="textSecondary">
										Date of Birth
									</Typography>
									<Typography variant="body1">
										{patient.dateOfBirth}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={4}>
									<Typography variant="subtitle1" color="textSecondary">
										Phone Number
									</Typography>
									<Typography variant="body1">
										{patient.phone}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={3}>
									<Typography variant="subtitle1" color="textSecondary">
										Street Address
									</Typography>
									<Typography variant="body1">
										{patient.address}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={3}>
									<Typography variant="subtitle1" color="textSecondary">
										City
									</Typography>
									<Typography variant="body1">
										{patient.city}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={3}>
									<Typography variant="subtitle1" color="textSecondary">
										Province
									</Typography>
									<Typography variant="body1">
										{patient.province}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={3}>
									<Typography variant="subtitle1" color="textSecondary">
										Country
									</Typography>
									<Typography variant="body1">
										{patient.country}
									</Typography>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
					<Grid item xs={5}>
						<Paper className={fixedHeightPaper}>
							<DiagnosisInfo patientID={patientID} drizzle={drizzle} drizzleState={drizzleState} />
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</div>
	);
}

export default PatientInfo;
