import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DiagnosisList({ patientID, drizzle, drizzleState }) {
	const [dataKey, setDataKey] = useState(null);
	const { PatientRecord } = drizzleState.contracts

	useEffect(() => {
		const contract = drizzle.contracts.PatientRecord;
		if (patientID) {
			const dataKey = contract.methods["recordCount"].cacheCall(patientID);
			setDataKey(dataKey);
		}
	}, [dataKey, drizzle.contracts.PatientRecord, patientID])

	const storedData = PatientRecord.recordCount[dataKey];
	const recordCount = (storedData && storedData.value);

	return <RetrieveRecords
		recordCount={recordCount}
		patientID={patientID}
		drizzle={drizzle}
		drizzleState={drizzleState}
	/>
}

function RetrieveRecords({ recordCount, patientID, drizzle, drizzleState }) {
	const [records, updateRecords] = useState([]);
	const [dataKey, setDataKey] = useState(null);
	const [open, setOpen] = useState(false);
	const { PatientRecord } = drizzleState.contracts;
	const [selectedRecord, setSelectedRecord] = useState({
		id: '',
		title: '',
	});

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		let records = [];
		for (let i = 1;i <= recordCount;i++) {
			const dataKey = drizzle.contracts.PatientRecord.methods["getRecord"].cacheCall(patientID, i);

			const storedData = PatientRecord.getRecord[dataKey];
			const record = (storedData && storedData.value);

			if (record) {
				const { 0: id, 1: title, 2: content } = record;

				const recordObject = {
					id: id,
					title: title,
					content: content
				}

				records.push(recordObject)
			}
		}
		updateRecords(records);

	}, [PatientRecord.getRecord, drizzle.contracts.PatientRecord.methods, patientID, recordCount])

	const columns = [
		{
			field: 'id',
			headerName: 'ID',
		},
		{
			field: 'title',
			headerName: 'Title',
			flex: 1,
		},
		{
			field: "",
			headerName: "Content",
			disableClickEventBubbling: true,
			disableColumnMenu: true,
			sortable: false,
			renderCell: (params) => {
				const thisRow = {};

				const handleClick = () => {
					const api = params.api;
					const fields = api
						.getAllColumns()
						.map((c) => c.field)
						.filter((c) => c !== "__check__" && !!c);


					fields.forEach((item) => {
						thisRow[item] = params.row[item] || '';
					});

					setSelectedRecord(thisRow);
					setOpen(true);
				}
				//selectedRecord => {}
				//records = [ {} ]
				return (
					<div>
						<Button color="primary" onClick={handleClick}>View</Button>
						<Dialog
							open={open}
							onClose={handleClose}
							aria-labelledby="record-dialog-title"
							aria-describedby="record-dialog-description"
						>
							<DialogTitle id="record-dialog-title">{"Record Content"} - {selectedRecord.title}</DialogTitle>
							<DialogContent>
								<DialogContentText id="record-dialog-description">
									{ records.map(record => record.content)[selectedRecord.id - 1] }
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleClose} color="primary">
									Close
								</Button>
							</DialogActions>
						</Dialog>
					</div>
				);
			}
		},
	];

	return (
		<div style={{ height: 400, width: '100%' }}>
			{/* recordList[recordID - 1].content */}
			<DataGrid
				style={{ width: '640px' }}
				rows={records}
				columns={columns}
				pageSize={5}
				disableSelectionOnClick
			/>



		</div>
	);
}