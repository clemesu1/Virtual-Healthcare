import React from 'react';
import { Button, Container } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
	const { loginWithRedirect, isAuthenticated } = useAuth0();
	return (
		!isAuthenticated && (
			<Container maxWidth="sm" style={
				{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center', 
					textAlign: 'center',
					minHeight: '50vh'
				}}>
				<Button
					className="button"
					variant="contained"
					color="primary"
					onClick={() => loginWithRedirect()}
				>
					Login
				</Button>
			</Container>
		)
	);
}

export default LoginButton;
