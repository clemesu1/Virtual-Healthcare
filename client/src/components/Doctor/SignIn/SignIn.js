import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Copyright from '../../Copyright/Copyright';
import { Link } from '@material-ui/core';
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
		marginTop: theme.spacing(1),
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

function SignIn({ setToken, drizzle, drizzleState, handleForgotPassword, handleSignUp }) {
	const classes = useStyles();
	const [dataKey, setDataKey] = useState(null);
	const { DoctorStorage } = drizzleState.contracts;
	const [redirect, setRedirect] = useState(false);
	const [errorMessage, setErrorMessage] = useState({});

	const [state, setState] = useState({
		email: "",
		password: ""
	})

	useEffect(() => {
		const contract = drizzle.contracts.DoctorStorage;
		const dataKey = contract.methods["doctorCount"].cacheCall();
		setDataKey(dataKey);
	}, [dataKey, drizzle.contracts.DoctorStorage]);

	const validate = () => {
		let temp = { ...errorMessage };
		if ('email' in state)
			temp.email = (/$^|.+@.+..+/.test(state.email)
				? ''
				: 'Email is not valid')
				|| (state.email ? '' : 'This field is required');
		if ('password' in state)
			if (state.password.length !== 0) {
				temp.password = '';
			} else {
				temp.password = 'This field is required'
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

	const handleSubmit = async e => {
		e.preventDefault();
		if (validate()) {
			const { email, password } = state;

			const storedData = DoctorStorage.doctorCount[dataKey];
			const doctorCount = (storedData && storedData.value);

			let loginError = false;
			for (let i = 1;i <= doctorCount;i++) {
				const contract = drizzle.contracts.DoctorStorage;
				const dataKey = contract.methods['getDoctor'].cacheCall(i);
				const doctor = DoctorStorage.getDoctor[dataKey];

				if (doctor) {
					const { 2: doctorEmail, 3: doctorPassword } = (doctor && doctor?.value);

					if (doctorEmail === email && doctorPassword === password) {
						// email and password match data found in blockchain						
						loginError = false;
						alert("Sign in successful!")

						const token = await loginDoctor({
							doctorEmail,
							doctorPassword
						});
						setToken(token);

						setRedirect(true);

						break;
					} else {
						loginError = true;
					}
				}
			}

			if (loginError) {
				alert("Error: incorrect email or password");
			}
		}
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
						Sign in
					</Typography>
					<form className={classes.form} onSubmit={handleSubmit}>
						<TextField
							variant="outlined"
							margin="normal"
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
							error={!!errorMessage.password}
							helperText={errorMessage.password}
						/>
						<FormControlLabel
							control={<Checkbox value="remember" color="primary" />}
							label="Remember me"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={handleSubmit}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link className={classes.link} onClick={handleForgotPassword}>
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link className={classes.link} onClick={handleSignUp}>
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
				<Box mt={8}>
					<Copyright />
				</Box>
			</Container>
		</React.Fragment>
	)
}

async function loginDoctor(credentials) {
	return fetch('http://localhost:8080/doctor-login', {
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


export default SignIn
