
import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { Link } from "react-router-dom";
import '../App/App.css';

export const mainListItems = (
	<div>
		<Link to="/" className="link">
			<ListItem button>
				<ListItemIcon>
					<DashboardIcon />
				</ListItemIcon>
				<ListItemText primary="Dashboard" />
			</ListItem>
		</Link>

		<Link to="/patients" className="link">
			<ListItem button>
				<ListItemIcon>
					<PeopleIcon />
				</ListItemIcon>
				<ListItemText primary="Patients" />
			</ListItem>
		</Link>

		<Link to="/calendar" className="link">
			<ListItem button>
				<ListItemIcon>
					<CalendarTodayIcon />
				</ListItemIcon>
				<ListItemText primary="Calendar" />
			</ListItem>
		</Link>

		<Link to="/settings" className="link">
			<ListItem button>
				<ListItemIcon>
					<SettingsIcon />
				</ListItemIcon>
				<ListItemText primary="Settings" />
			</ListItem>
		</Link>

		<Link to="/help" className="link">
			<ListItem button>
				<ListItemIcon>
					<HelpIcon />
				</ListItemIcon>
				<ListItemText primary="Help" />
			</ListItem>
		</Link>
	</div>
);

export const secondaryListItems = (
	<div>
		<ListItem button >
			<ListItemIcon>
				<PowerSettingsNewIcon />
			</ListItemIcon>
			<ListItemText primary="Log Out" />
		</ListItem>
	</div>
);
