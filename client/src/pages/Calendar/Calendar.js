import React, { useState } from 'react'
import { Container } from '@material-ui/core';
import { Calendar as ReactCalendar } from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

function Calendar() {
	const [value, onChange] = useState(new Date());

	return (
		<Container>
			<ReactCalendar
				className="react-calendar calendar"
				onChange={onChange}
				value={value}
			/>
		</Container>
	)
}

export default Calendar
