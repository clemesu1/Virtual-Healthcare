import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, CssBaseline, Drawer, Box, AppBar, Toolbar, List, Typography, Divider, IconButton, Container } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import { mainListItems, secondaryListItems } from './listItems';
import { Switch, Route } from "react-router-dom";
import Copyright from '../../Copyright/Copyright';
import { useAuth0 } from '@auth0/auth0-react';

import Home from '../../../pages/Home/Home';
import Patients from '../../../pages/Patients/Patients';
import Calendar from '../../../pages/Calendar/Calendar';
import Settings from '../../../pages/Settings/Settings';

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

export default function Dashboard({ drizzle, drizzleState }) {
	const classes = useStyles();
	const [open, setOpen] = useState(true);
	const [dataKey, setDataKey] = useState(null);
	const { PatientRecord } = drizzleState.contracts;
	const { user, isAuthenticated } = useAuth0();

	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;
		const dataKey = contract.methods["patientCount"].cacheCall();
		setDataKey(dataKey);
	}, [dataKey, drizzle.contracts.PatientRecord]);


	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const storedData = PatientRecord.patientCount[dataKey];
	const patientCount = (storedData && storedData.value);

	return (
		isAuthenticated && (
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
						<Avatar alt={user.name} src={user.picture} />
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
							<Home drizzle={drizzle} drizzleState={drizzleState} patientCount={patientCount} />
						</Route>
						<Route path="/patients">
							<Patients drizzle={drizzle} drizzleState={drizzleState} patientCount={patientCount} />
						</Route>
						<Route path="/calendar">
							<Calendar />
						</Route>
						<Route path="/settings">
							<Settings />
						</Route>
					</Switch>

				</Container>
				<Box pt={4}>
					<Copyright />
				</Box>
			</main>
		</div>
		)
	)
}

