import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline, Drawer, Box, AppBar, Toolbar, List, Typography, Divider, IconButton, Container, Link } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { mainListItems, secondaryListItems } from './listItems';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import Dashboard from '../../pages/Dashboard/Dashboard';
import Patients from '../../pages/Patients/Patients';
import Calendar from '../../pages/Calendar/Calendar';

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://www.unb.ca/">
				Colin LeMesurier
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
	toolbarIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		background: '#4264d0',
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	menuButtonHidden: {
		display: 'none',
	},
	title: {
		flexGrow: 1,
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9),
		},
	},
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto',
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	}
}));

function Home({ drizzle, drizzleState }) {
	const classes = useStyles();
	const [open, setOpen] = useState(true);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<Router>
			<div className={classes.root}>
				<CssBaseline />
				<AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
					<Toolbar className={classes.toolbar}>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="open drawer"
							onClick={handleDrawerOpen}
							className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
						>
							<MenuIcon />
						</IconButton>
						<Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
							Virtual Healthcare
						</Typography>
						<IconButton color="inherit">
							<AccountCircleIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				<Drawer
					variant="permanent"
					classes={{
						paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
					}}
					open={open}
				>
					<div className={classes.toolbarIcon}>
						<IconButton onClick={handleDrawerClose}>
							<ChevronLeftIcon />
						</IconButton>
					</div>
					<Divider />
					<List>{mainListItems}</List>
					<List style={{ marginTop: 'auto' }}>{secondaryListItems}</List>
				</Drawer>
				<main className={classes.content}>
					<div className={classes.appBarSpacer} />
					<Container maxWidth="xl" className={classes.container}>
						<Switch>
							<Route exact path="/">
								<Dashboard />
							</Route>
							<Route path="/patients">
								<Patients drizzle={drizzle} drizzleState={drizzleState} />
							</Route>
							<Route path="/calendar">
								<Calendar />
							</Route>
						</Switch>

						<Box pt={4}>
							<Copyright />
						</Box>

					</Container>

				</main>
			</div>
		</Router>

	)
}

export default Home;