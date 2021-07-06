import { useState } from 'react';

export default function useToken() {
	function getToken() {
		const tokenString = localStorage.getItem('token');
		const patientToken = JSON.parse(tokenString);
		return patientToken?.token
	}
	const [token, setToken] = useState(getToken());

	const saveToken = patientToken => {
		localStorage.setItem('token', JSON.stringify(patientToken));
		setToken(patientToken.token);
	}

	return {
		setToken: saveToken,
		token
	}

}