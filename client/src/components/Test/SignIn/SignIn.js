import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import {
	Avatar, Button, CssBaseline, TextField, FormControlLabel,
	Checkbox, Grid, Box, Typography, Container, AppBar, Toolbar, Paper
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Copyright from '../../Copyright/Copyright';

import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main,
	},
	appBar: {
		position: 'relative',
	},
	paper: {
		marginTop: theme.spacing(6),
		marginBottom: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
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
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	link: {
		color: theme.palette.primary.main,
		textDecoration: 'none',
		'&:hover': {
			textDecoration: 'underline',
		},
	},
}));

export default function SignIn({ setToken, drizzle, drizzleState }) {
	const classes = useStyles();
	const [dataKey, setDataKey] = useState(null);
	const { PatientRecord } = drizzleState.contracts;

	const [state, setState] = useState({
		email: "",
		password: ""
	});

	function handleChange(e) {
		setState({
			...state,
			[e.target.name]: e.target.value
		});
	}

	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;
		const dataKey = contract.methods["patientCount"].cacheCall();
		setDataKey(dataKey);
	}, [dataKey, drizzle.contracts.PatientRecord]);

	const handleSignIn = e => {
		e.preventDefault();

		const email = state.email;
		const password = state.password;


		const storedData = PatientRecord.patientCount[dataKey];

		const patientCount = (storedData && storedData.value);

		for (let i = 1;i <= patientCount;i++) {
			const contract = drizzle.contracts.PatientRecord;
			const dataKey = contract.methods["getPatient"].cacheCall(i);
			const patient = PatientRecord.getPatient[dataKey];

			if (patient) {
				const { 0: patientID, 1: patientJSON } = (patient && patient?.value);

				const patientObject = JSON.parse(patientJSON);

				if (patientObject.email === email && patientObject.password === password && email !== "" && password !== "") {
					const token = await loginPatient({
						email,
						password
					});
					setToken(token);
					break;
				} else {
					alert('Sign In Error')
				}
			}
		}

	}

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

					<Container component="main" maxWidth="xs" className={classes.section}>
						<div className={classes.paper}>
							<Avatar className={classes.avatar}>
								<LockOutlinedIcon />
							</Avatar>
							<Typography component="h1" variant="h5">
								Sign in
							</Typography>
							<div className={classes.form} >
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									autoFocus
									value={state.email}
									onChange={handleChange}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
									value={state.password}
									onChange={handleChange}
								/>
								<FormControlLabel
									control={
										<Checkbox
											value="remember"
											color="primary"
										/>}
									label="Remember me"
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
									onClick={handleSignIn}
								>
									Sign In
								</Button>
								<Grid container>
									<Grid item xs>
										<Link to="/forgotpassword" className={classes.link}>
											<Typography variant="body2" >
												Forgot password?
											</Typography>
										</Link>
									</Grid>
									<Grid item>
										<Link to="/signup" className={classes.link}>
											<Typography variant="body2" >
												{"Don't have an account? Sign Up"}
											</Typography>
										</Link>
									</Grid>
								</Grid>
							</div>
						</div>

					</Container>
				</Paper>
			</main>
			<Box mt={8}>
				<Copyright />
			</Box>
		</React.Fragment>
	);
}

async function loginPatient(credentials) {
	return fetch('http://localhost:8080/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentials)
	})
		.then(data => data.json())
}


SignIn.propTypes = {
	setToken: PropTypes.func.isRequired
}