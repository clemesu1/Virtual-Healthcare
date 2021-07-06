import React, { useState } from 'react';
import { useMediaQuery, Dialog, DialogTitle, DialogContent, Stepper, Step, StepLabel, Typography, Button, Container, Avatar, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { LockOutlined as LockOutlinedIcon, PersonOutline as PersonOutlineIcon, MailOutlined as MailOutlinedIcon, InfoOutlined as InfoOutlinedIcon } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MuiPhoneInput from 'material-ui-phone-number';

const useStyles = makeStyles((theme) => ({
	dialogContent: {
		marginBottom: theme.spacing(3)
	},
	stepper: {
		padding: theme.spacing(3, 0, 5)
	},
	stepperButtons: {
		display: 'flex',
		justifyContent: 'center'
	},
	button: {
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(1)
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main
	},
	appBar: {
		position: 'relative'
	},
	layout: {
		width: 'auto',
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
		[theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
			width: 600,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	},
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	form: {
		width: '100%',
		marginTop: '3rem'
	}
}));

const AddPatientDialog = ({ drizzle, drizzleState, open, handleClose }) => {
	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const [stackId, setStackID] = useState(null);
	const [activeStep, setActiveStep] = useState(0);
	const [dateOfBirth, setDateOfBirth] = useState(new Date());
	const [state, setState] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
		medicare: "",
		gender: "",
		dateOfBirth: "",
		phone: "",
		address: "",
		city: "",
		province: "",
		postalCode: "",
		country: "",
	});
	const [phone, setPhone] = useState('');
	const [errorMessage, setErrorMessage] = useState({});

	const steps = ['Account', 'Personal', 'Contact', 'Review'];


	const handleDateChange = (date) => {
		setDateOfBirth(date);
	};

	const handlePhoneChange = (phone) => {
		setPhone(phone);
	}

	const handleNext = () => {
		setActiveStep(activeStep + 1);

	};

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

	const handleChange = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value
		});
	}

	const validate = () => {
		let temp = { ...errorMessage };

		if ('email' in state)
			temp.email = (/$^|.+@.+..+/.test(state.email)
				? ''
				: 'Email is not valid')
				|| (state.email ? '' : 'This field is required');
		if ('password' in state)
			if (state.password.length !== 0) {
				if (state.password === state.confirmPassword) {
					temp.password = '';
				} else {
					temp.password = 'Passwords do not match'
				}
			} else {
				temp.password = 'This field is required'
			}
		if ('confirmPassword' in state)
			if (state.confirmPassword.length !== 0) {
				if (state.password === state.confirmPassword) {
					temp.confirmPassword = '';
				} else {
					temp.confirmPassword = 'Passwords do not match'
				}
			} else {
				temp.confirmPassword = 'This field is required'
			}

		if ('firstName' in state)
			temp.firstName = state.firstName ? '' : 'This field is required';
		if ('lastName' in state)
			temp.lastName = state.lastName ? '' : 'This field is required';
		if ('medicare' in state)
			temp.medicare = state.medicare ? '' : 'This field is required';
		if ('gender' in state)
			temp.gender = state.gender ? '' : 'This field is required';
		if ('dateOfBirth' in state)
			temp.dateOfBirth = dateOfBirth ? '' : 'This field is required';
		if ('phone' in state)
			temp.phone = phone ? '' : 'This field is required';
		if ('address' in state)
			temp.address = state.address ? '' : 'This field is required';
		if ('city' in state)
			temp.city = state.city ? '' : 'This field is required';
		if ('province' in state)
			temp.province = state.province ? '' : 'This field is required';
		if ('postalCode' in state)
			temp.postalCode = state.postalCode ? '' : 'This field is required';
		if ('country' in state)
			temp.country = state.country ? '' : 'This field is required';
		setErrorMessage({ ...temp })

		if (state) return Object.values(temp).every((x) => x === '');
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			const contract = drizzle.contracts.PatientRecord;

			const email = state.email;
			const password = state.password;
			const name = state.firstName + " " + state.lastName;
			const medicare = state.medicare;
			const gender = state.gender;
			const streetAddress = state.address;
			const city = state.city;
			const province = state.province;
			const postalCode = state.postalCode;
			const country = state.country;

			const patientInfo = {
				email: email,
				password: password,
				name: name,
				medicare: medicare,
				gender: gender,
				dateOfBirth: dateOfBirth.toLocaleString().split(',')[0],
				phone: phone,
				streetAddress: streetAddress,
				city: city,
				province: province,
				postalCode: postalCode,
				country: country
			}

			const patientJSON = JSON.stringify(patientInfo);

			const stackId = contract.methods["createPatient"].cacheSend(patientJSON, medicare,
				{ from: drizzleState.accounts[0], gas: 3000000 }
			);

			setStackID(stackId);
		}
	}

	function getTxStatus() {
		const { transactions, transactionStack } = drizzleState

		const txHash = transactionStack[stackId]

		if (!txHash) return null;

		return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`
	}

	return (
		<Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
			<DialogTitle>Add Patient</DialogTitle>
			<DialogContent className={classes.dialogContent}>
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
							<form>
								{getStepContent(activeStep)}
							</form>
							<div className={classes.stepperButtons}>
								{activeStep !== 0 && (
									<Button className={classes.button} onClick={handleBack}>
										Back
									</Button>
								)}
								<Button
									className={classes.button}
									variant="contained"
									color="primary"
									onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
								>
									{activeStep === steps.length - 1 ? "Submit" : "Next"}
								</Button>
							</div>
						</React.Fragment>
					)}
				</React.Fragment>
			</DialogContent>

		</Dialog>
	)

	function getStepContent(step) {
		switch (step) {
			case 0:
				return (
					<Container component="main" maxWidth="xs">

						<div className={classes.paper}>
							<Avatar className={classes.avatar}>
								<LockOutlinedIcon />
							</Avatar>

							<Typography component="h1" variant="h5">
								Account Information
							</Typography>

							<div className={classes.form}>
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
											error={!!errorMessage.email}

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
											error={!!errorMessage.password}

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
											error={!!errorMessage.confirmPassword}
										/>
									</Grid>
								</Grid>
							</div>
						</div>
					</Container>);
			case 1:
				return (<Container component="main" maxWidth="xs">

					<div className={classes.paper}>
						<Avatar className={classes.avatar}>
							<PersonOutlineIcon />
						</Avatar>

						<Typography component="h1" variant="h5">
							Personal Information
						</Typography>

						<div className={classes.form}>
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
										error={!!errorMessage.firstName}
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
										error={!!errorMessage.lastName}
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
										error={!!errorMessage.medicare}
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
											error={!!errorMessage.gender}
										>
											<MenuItem value='Male'>Male</MenuItem>
											<MenuItem value='Female'>Female</MenuItem>
											<MenuItem value='Other'>Other</MenuItem>
										</Select>
									</FormControl>
								</Grid>

								<Grid item xs={12} sm={6}>
									<MuiPickersUtilsProvider utils={DateFnsUtils} fullWidth >
										<KeyboardDatePicker
											autoOk
											variant="inline"
											inputVariant="outlined"
											format="MM/dd/yyyy"
											id="dateOfBirth"
											label="Date of Birth"
											value={dateOfBirth}
											onChange={handleDateChange}
											fullWidth
											KeyboardButtonProps={{
												'aria-label': 'change date',
											}}
											error={!!errorMessage.dateOfBirth}
										/>
									</MuiPickersUtilsProvider>
								</Grid>

							</Grid>
						</div>
					</div>
				</Container>);
			case 2:
				return (
					<Container component="main" maxWidth="xs">

						<div className={classes.paper}>
							<Avatar className={classes.avatar}>
								<MailOutlinedIcon />
							</Avatar>

							<Typography component="h1" variant="h5">
								Contact Information
							</Typography>

							<div className={classes.form}>
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
											error={!!errorMessage.phone}

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
											error={!!errorMessage.address}
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
											error={!!errorMessage.city}
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
											error={!!errorMessage.province}
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
											error={!!errorMessage.postalCode}
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
											error={!!errorMessage.country}
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

	function Review() {
		return (
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<InfoOutlinedIcon />
				</Avatar>

				<Typography component="h1" variant="h5">
					Review Your Information
				</Typography>


				<Container className={classes.form}>
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
}

export default AddPatientDialog
