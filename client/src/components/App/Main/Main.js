import React, { useState } from 'react';

import SignUp from '../../Doctor/Account/SignUp';
import SignIn from '../../Doctor/Account/SignIn';
import ForgotPassword from '../../Doctor/Account/ForgotPassword';
import Dashboard from '../../Doctor/Dashboard/Dashboard'
import useToken from './useToken';

export default function Main({ drizzle, drizzleState }) {
	const { token, setToken } = useToken();
	const [showSignIn, setShowSignIn] = useState(true);
	const [showSignUp, setShowSignUp] = useState(false);
	const [showForgotPassword, setShowForgotPassword] = useState(false);

	const handleSignIn = async e => {
		e.preventDefault();
		setShowSignUp(false);
		setShowForgotPassword(false);
		setShowSignIn(true);
	}
	const handleSignUp = async e => {
		e.preventDefault();
		setShowSignIn(false);
		setShowSignUp(true);
	}
	const handleForgotPassword = async e => {
		e.preventDefault();
		setShowSignIn(false);
		setShowForgotPassword(true);
	}

	function OpenPage() {
		if (!token) {
			if (showSignIn) {
				return <SignIn setToken={setToken} drizzle={drizzle} drizzleState={drizzleState} handleForgotPassword={handleForgotPassword} handleSignUp={handleSignUp} />
			}
			else if (showSignUp) {
				return <SignUp drizzle={drizzle} drizzleState={drizzleState} handleSignIn={handleSignIn} />
			}
			else if (showForgotPassword) {
				return <ForgotPassword drizzle={drizzle} drizzleState={drizzleState} handleSignIn={handleSignIn} />
			}
			else {
				return null
			}
		} else {
			return <Dashboard drizzle={drizzle} drizzleState={drizzleState} />
		}
	}

	return <OpenPage />
}

