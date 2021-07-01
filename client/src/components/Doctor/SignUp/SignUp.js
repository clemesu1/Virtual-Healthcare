import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Avatar, Grid, TextField, Button, Box, Link } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Copyright from '../../Copyright/Copyright';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	link: {
		cursor: 'default',
		'&:hover': {
			cursor: 'pointer'
		},
		marginTop: theme.spacing(3),
	},
}));

function SignUp({ drizzle, drizzleState, handleSignIn }) {
	const classes = useStyles();
	const [stackId, setStackID] = useState(null);
	const [errorMessage, setErrorMessage] = useState({});

	const [state, setState] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: ""
	});

	const validate = () => {
		let temp = { ...errorMessage };
		if ('firstName' in state)
			temp.firstName = state.firstName ? '' : 'This field is required';
		if ('lastName' in state)
			temp.lastName = state.lastName ? '' : 'This field is required';
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
		setErrorMessage({ ...temp })

		if (state) return Object.values(temp).every((x) => x === '');
	}

	function handleChange(e) {
		setState({
			...state,
			[e.target.name]: e.target.value
		});
	}

	function handleSubmit(e) {
		if (validate()) {
			const { firstName, lastName, email, password } = state;
			const name = firstName + " " + lastName;

			const contract = drizzle.contracts.DoctorStorage;

			const stackId = contract.methods['createDoctor'].cacheSend(name, email, password,
				{ from: drizzleState.accounts[0], gas: 3000000 }
			);

			setStackID(stackId)
			// handleSignIn(e)

		}

	}

	function getTxStatus() {
		// get the transaction states from the drizzle state
		const { transactions, transactionStack } = drizzleState

		// get the transaction hash using our saved `stackId`
		const txHash = transactionStack[stackId]

		// if transaction hash does not exist, don't display anything
		if (!txHash) return null;

		if (txHash) {
			alert(transactions[txHash] && transactions[txHash].status)
		}

		// otherwise, return the transaction status
		return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`
	}

	return (
		<React.Fragment>

			<CssBaseline />
			<AppBar position="absolute" color="default" className={classes.appBar}>
				<Toolbar>

					<Typography variant="h6" color="inherit" noWrap>
						Virtual Healthcare
					</Typography>

				</Toolbar>
			</AppBar>

			<Container component="main" maxWidth="xs">
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
				</div>
				<div className={classes.form} >
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="given-name"
								name="firstName"
								variant="outlined"
								required
								fullWidth
								id="firstName"
								label="First Name"
								value={state.firstName}
								onChange={handleChange}
								error={!!errorMessage.firstName}
								helperText={errorMessage.firstName}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="lastName"
								label="Last Name"
								name="lastName"
								autoComplete="family-name"
								value={state.lastName}
								onChange={handleChange}
								error={!!errorMessage.lastName}
								helperText={errorMessage.lastName}
							/>
						</Grid>
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
								helperText={errorMessage.email}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
								value={state.password}
								onChange={handleChange}
								error={!!errorMessage.password}
								helperText={errorMessage.password}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="confirmPassword"
								label="Confirm Password"
								type="password"
								id="confirmPassword"
								autoComplete="current-password"
								value={state.confirmPassword}
								onChange={handleChange}
								error={!!errorMessage.confirmPassword}
								helperText={errorMessage.confirmPassword}

							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={handleSubmit}
					>
						Sign Up
					</Button>
					<Grid container justify="flex-end">
						<Grid item>
							<Link className={classes.link} onClick={handleSignIn}>
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
					<div>{getTxStatus()}</div>
				</div>
				<Box mt={5}>
					<Copyright />
				</Box>
			</Container>
		</React.Fragment>
	);
}

export default SignUp;
