import React, { useState } from 'react';

import SignUp from '../Doctor/SignUp/SignUp';
import SignIn from '../Doctor/SignIn/SignIn';
import ForgotPassword from '../Doctor/ForgotPassword/ForgotPassword';
import Home from '../Home/Home';
import useToken from './useToken';

function Main({ drizzle, drizzleState }) {
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

	function DoctorPage() {
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
			return <Home drizzle={drizzle} drizzleState={drizzleState} />
		}
	}

	return (
		<DoctorPage />
	)
}

export default Main
