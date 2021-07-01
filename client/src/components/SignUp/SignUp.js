import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Container, CssBaseline, Avatar, Typography, Grid, TextField, FormControl, Select, MenuItem, InputLabel,
	AppBar, Toolbar, Paper, Stepper, Step, StepLabel, Button
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import MailOutlinedIcon from '@material-ui/icons/MailOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MuiPhoneInput from 'material-ui-phone-number';
import Copyright from '../Copyright/Copyright';
import './SignUp.css';

import {
	Link
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main,
	},
	appBar: {
		position: 'relative',
	},
	layout: {
		width: 'auto',
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
		[theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
			width: 600,
			marginLeft: 'auto',
			marginRight: 'auto',
		},
	},
	paper: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
		padding: theme.spacing(2),
		[theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
			marginTop: theme.spacing(6),
			marginBottom: theme.spacing(6),
			padding: theme.spacing(3),
		},
	},
	stepper: {
		padding: theme.spacing(3, 0, 5),
	},
	buttons: {
		display: 'flex',
		justifyContent: 'center',
	},
	button: {
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(1),
	},
	link: {
		color: theme.palette.primary.main,
		textDecoration: 'none',
		'&:hover': {
			textDecoration: 'underline',
		},
		marginTop: theme.spacing(3),

	},
}));

export default function SignUp({ drizzle, drizzleState }) {
	const classes = useStyles();
	const [stackId, setStackID] = useState(null);
	const [dateOfBirth, setDateOfBirth] = useState(new Date());
	const [state, setState] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
		medicare: "",
		gender: "",
		address: "",
		city: "",
		province: "",
		postalCode: "",
		country: "",
	});

	const [phone, setPhone] = useState('');

	function handleChange(e) {
		setState({
			...state,
			[e.target.name]: e.target.value
		});
	}

	const handleDateChange = (date) => {
		setDateOfBirth(date);
	};

	const handlePhoneChange = (phone) => {
		setPhone(phone);
	}

	function handleSubmit(e) {
		const email = state.email;
		const password = state.password;
		const name = state.firstName + " " + state.lastName;
		const medicare = state.medicare;
		const gender = state.gender;
		const address = state.address;
		const city = state.city;
		const province = state.province;
		const postalCode = state.postalCode;
		const country = state.country;

		const contract = drizzle.contracts.PatientRecord;

		const patientObject = {
			email: email,
			password: password,
			name: name,
			medicare: medicare,
			gender: gender,
			dateOfBirth: dateOfBirth.toLocaleString().split(',')[0],
			phone: phone,
			address: address,
			city: city,
			province: province,
			postalCode: postalCode,
			country: country
		};

		const patientJSON = JSON.stringify(patientObject);

		// let drizzle know we want to call the `createPatient` method with `patientJSON` and `medicare`
		const stackId = contract.methods["createPatient"].cacheSend(patientJSON, medicare,
			{ from: drizzleState.accounts[0], gas: 3000000 }
		);

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

	// Account Information -> Personal Information -> Contact Information -> Review Information

	function Review() {
		return (
			<div className="paper">
				<Avatar className={classes.avatar}>
					<InfoOutlinedIcon />
				</Avatar>

				<Typography component="h1" variant="h5">
					Review Your Information
				</Typography>


				<Container className="form">
					<Grid container spacing={1}>

						<Grid item xs={12}>
							<Typography variant="body1">
								<b>Email:</b> {state.email}
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body1">
								<b>First Name:</b> {state.firstName}
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body1">
								<b>Last Name:</b> {state.lastName}
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body1">
								<b>Medicare Number:</b> {state.medicare}
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body1">
								<b>Gender:</b> {state.gender}
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body1">
								<b>Date of Birth:</b> {dateOfBirth.toLocaleString().split(',')[0]}
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body1">
								<b>Phone:</b> {phone}
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body1">
								<b>Street Address:</b> {state.address}
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body1">
								<b>City:</b> {state.city}
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body1">
								<b>Province:</b> {state.province}
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body1">
								<b>Postal Code:</b> {state.postalCode}
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body1">
								<b>Country:</b> {state.country}
							</Typography>
						</Grid>
					</Grid>
				</Container>
				<div>{getTxStatus()}</div>

			</div>
		);
	}

	const steps = ['Account', 'Personal', 'Contact', 'Review'];

	function getStepContent(step) {
		switch (step) {
			case 0:
				return (<Container component="main" maxWidth="xs">
					<CssBaseline />

					<div className="paper">
						<Avatar className={classes.avatar}>
							<LockOutlinedIcon />
						</Avatar>

						<Typography component="h1" variant="h5">
							Account Information
						</Typography>

						<div className="form">
							<Grid container spacing={2}>

								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="email"
										label="Email Address"
										name="email"
										autoComplete="email"
										value={state.email}
										onChange={handleChange}
										autoFocus
									/>
								</Grid>

								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										type="password"
										id="password"
										label="Password"
										name="password"
										autoComplete="current-password"
										value={state.password}
										onChange={handleChange}
									/>
								</Grid>

								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										type="password"
										id="confirmPassword"
										label="Confirm Password"
										name="confirmPassword"
										autoComplete="current-password"
										value={state.confirmPassword}
										onChange={handleChange}
										error={state.confirmPassword !== "" && state.password !== state.confirmPassword}
									/>
								</Grid>
							</Grid>
						</div>
					</div>
				</Container>);
			case 1:
				return (<Container component="main" maxWidth="xs">
					<CssBaseline />

					<div className="paper">
						<Avatar className={classes.avatar}>
							<PersonOutlineIcon />
						</Avatar>

						<Typography component="h1" variant="h5">
							Personal Information
						</Typography>

						<div className="form">
							<Grid container spacing={2}>

								<Grid item xs={12} sm={6}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="firstName"
										name="firstName"
										label="First Name"
										autoComplete="given-name"
										value={state.firstName}
										onChange={handleChange}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="lastName"
										name="lastName"
										label="Last Name"
										autoComplete="family-name"
										value={state.lastName}
										onChange={handleChange}
									/>
								</Grid>

								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="medicare"
										name="medicare"
										label="Medicare Number"
										autoComplete="medicare"
										value={state.medicare}
										type="number"
										onChange={handleChange}
										onInput={(e) => {
											e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 9)
										}}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<FormControl variant="outlined" fullWidth>
										<InputLabel id="gender">Gender</InputLabel>

										<Select
											label="Gender"
											id="gender"
											name="gender"
											autoComplete="sex"
											value={state.gender}
											onChange={handleChange}
										>
											<MenuItem value='Male'>Male</MenuItem>
											<MenuItem value='Female'>Female</MenuItem>
											<MenuItem value='Other'>Other</MenuItem>
										</Select>
									</FormControl>
								</Grid>

								<Grid item xs={12} sm={6}>
									<MuiPickersUtilsProvider utils={DateFnsUtils} fullWidth>
										<KeyboardDatePicker
											autoOk
											variant="inline"
											inputVariant="outlined"
											format="MM/dd/yyyy"
											id="dateOfBirth"
											label="Date of Birth"
											value={dateOfBirth}
											onChange={handleDateChange}

											KeyboardButtonProps={{
												'aria-label': 'change date',
											}}
										/>
									</MuiPickersUtilsProvider>
								</Grid>

							</Grid>
						</div>
					</div>
				</Container>);
			case 2:
				return (<Container component="main" maxWidth="xs">
					<CssBaseline />

					<div className="paper">
						<Avatar className={classes.avatar}>
							<MailOutlinedIcon />
						</Avatar>

						<Typography component="h1" variant="h5">
							Contact Information
						</Typography>

						<div className="form">
							<Grid container spacing={2}>

								<Grid item xs={12}>

									<MuiPhoneInput
										defaultCountry='ca'
										variant="outlined"
										required
										fullWidth
										id="phone"
										label="Phone Number"
										autoComplete="tel"
										value={phone}
										onChange={handlePhoneChange}
									/>
								</Grid>

								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="address"
										name="address"
										label="Street Address"
										autoComplete="shipping street-address"
										value={state.address}
										onChange={handleChange}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="city"
										name="city"
										label="City"
										autoComplete="shipping locality"
										value={state.city}
										onChange={handleChange}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="province"
										name="province"
										label="Province"
										autoComplete="shipping region"
										value={state.province}
										onChange={handleChange}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="postalCode"
										name="postalCode"
										label="Postal Code"
										autoComplete="shipping postal-code"
										value={state.postalCode}
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="country"
										name="country"
										label="Country"
										autoComplete="shipping country-name"
										value={state.country}
										onChange={handleChange}
									/>
								</Grid>
							</Grid>
						</div>
					</div>
				</Container>);
			case 3:
				return (<Review />);
			default:
				throw new Error('Unknown step');
		}
	}

	const [activeStep, setActiveStep] = React.useState(0);
	const handleNext = () => {
		const { password, confirmPassword } = state;
		if (password !== confirmPassword) {
			alert("Passwords do not match.")
		} else if (password === '' || confirmPassword === '') {
			alert("Input fields are empty.")
		} else {
			setActiveStep(activeStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};


	return (
		<React.Fragment>
			<CssBaseline />

			<AppBar position="absolute" color="default" className={classes.appBar}> {/* style={{ background: '#4264d0' }} */}
				<Toolbar>
					<Typography variant="h6" color="inherit" noWrap>
						Virtual Healthcare
					</Typography>
				</Toolbar>
			</AppBar>

			<main className={classes.layout}>
				<Paper className={classes.paper}>

					<Stepper
						activeStep={activeStep}
						className={classes.stepper}
						alternativeLabel
					>
						{
							steps.map((label) => (
								<Step key={label}>
									<StepLabel>{label}</StepLabel>
								</Step>
							))
						}
					</Stepper>

					<React.Fragment>
						{activeStep === steps.length ? (
							<React.Fragment>
								<Typography variant="h5" gutterBottom>
									Thank you for registering!
								</Typography>
							</React.Fragment>
						) : (
							<React.Fragment>
								{getStepContent(activeStep)}
								<div className={classes.buttons}>
									{activeStep !== 0 && (
										<Button onClick={handleBack} className={classes.button}>
											Back
										</Button>
									)}
									<Button variant="contained"
										color="primary"
										onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
										className={classes.button}
									>
										{activeStep === steps.length - 1 ? "Submit" : "Next"}
									</Button>
								</div>

							</React.Fragment>
						)}
					</React.Fragment>

					<Grid container justify="center" className={classes.link}>
						<Grid item>
							<Link to="/" className={classes.link}>
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>

				</Paper>


				<Copyright />
			</main>
		</React.Fragment>
	)
}