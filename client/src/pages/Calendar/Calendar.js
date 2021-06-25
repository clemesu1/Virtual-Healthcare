import React from 'react'
import { Calendar as ReactCalendar } from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

function Calendar() {
	return (
		<div>
			<ReactCalendar className="calendar"/>
		</div>
	)
}

export default Calendar
