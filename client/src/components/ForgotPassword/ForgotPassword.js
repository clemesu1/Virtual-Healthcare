import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Container, CssBaseline, Avatar, Typography, Grid, TextField, 
	AppBar, Toolbar, Paper, Button
} from '@material-ui/core';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import { Link } from "react-router-dom";

import Copyright from '../Copyright/Copyright';

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
	button: {
		display: 'flex',
		justifyContent: 'center',
		marginBottom: theme.spacing(3),
	},
	link: {
		color: theme.palette.primary.main,
		textDecoration: 'none',
		'&:hover': {
			textDecoration: 'underline',
		},
	},
}));

function ForgotPassword({ drizzle, drizzleState }) {
	const classes = useStyles();

	const [email, setEmail] = useState();

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
								<VpnKeyOutlinedIcon />
							</Avatar>
							<Typography component="h1" variant="h5">
								Forgot Password
							</Typography>
							<div className={classes.form}>

								<Typography component="h2" variant="body2" color="textSecondary">
									Lost your password? Please enter your email address. You will receive a link to create a new password via email.
								</Typography>

								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									autoFocus
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>

								<div className={classes.button}>
									<Button
										type="submit"
										variant="contained"
										color="primary"
										className={classes.submit}
									>
										Reset Password
									</Button>
								</div>
								<Grid container>
									<Grid item xs>
										<Link to="/" className={classes.link}>
											<Typography variant="body2" >
												Remember your password?
											</Typography>
										</Link>
									</Grid>
								</Grid>
							</div>
						</div>
					</Container>
				</Paper>
				<Copyright />

			</main>

		</React.Fragment>
	)
}

export default ForgotPassword
