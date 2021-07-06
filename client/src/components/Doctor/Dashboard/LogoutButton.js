import React from 'react'

import { Button, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

export default function LogoutButton() {
	const { logout, isAuthenticated } = useAuth0();

	return (
		isAuthenticated && (
			<Button onClick={() => logout()}>
				<ListItem button >
					<ListItemIcon>
						<PowerSettingsNewIcon />
					</ListItemIcon>
					<ListItemText primary="Log Out" />
				</ListItem>
			</Button>
		)
	)
}
