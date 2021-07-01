import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Avatar, Grid, TextField, Button, Box, Link } from '@material-ui/core';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import Copyright from '../../Copyright/Copyright';

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

function ForgotPassword({ drizzle, drizzleState, handleSignIn }) {
	const classes = useStyles();

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
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<VpnKeyOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Forgot Password
					</Typography>
					<div className={classes.form} noValidate>
						<Typography component="h2" variant="body1" color="textSecondary">
							Lost your password? Please enter your email address. You will receive a link to create a new password via email.
						</Typography>
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
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Reset Password
						</Button>
						<Grid container>
							<Grid item>
								<Link className={classes.link} onClick={handleSignIn}>
									{"Remember your password?"}
								</Link>
							</Grid>
						</Grid>
					</div>
				</div>
				<Box mt={8}>
					<Copyright />
				</Box>
			</Container>

		</React.Fragment>
	)
}

export default ForgotPassword
