// import React, { useState, useEffect } from "react";
// import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
// import { DataGrid } from "@material-ui/data-grid";

// const DiagnosisList = ({ drizzle, drizzleState, patientID }) => {
// 	const { PatientRecord } = drizzleState.contracts;
// 	const [dataKey, setDataKey] = useState(null);

// 	useEffect(() => {
// 		const contract = drizzle.contracts.PatientRecord;
// 		if (patientID) {
// 			const dataKey = contract.methods["recordCount"].cacheCall(patientID);
// 			setDataKey(dataKey);
// 		}
// 	}, [patientID, dataKey, drizzle.contracts.PatientRecord]);

// 	const storedData = PatientRecord.recordCount[dataKey];
// 	const recordCount = (storedData && storedData.value);

// 	return (
// 		<RetrieveRecords
// 			recordCount={recordCount}
// 			patientID={patientID}
// 			drizzle={drizzle}
// 			drizzleState={drizzleState}
// 		/>
// 	)
// }

// function RetrieveRecords({ recordCount, patientID, drizzle, drizzleState }) {
// 	const [records, updateRecords] = useState([]);
// 	const [open, setOpen] = useState(false);
// 	const { PatientRecord } = drizzleState.contracts;
// const [selectedRecord, setSelectedRecord] = useState({
// 	id: '',
// 	title: '',
// });

// 	const handleClose = () => {
// 		setOpen(false);
// 	};

// 	useEffect(() => {
// 		let records = [];
// 		for (let i = 1;i <= recordCount;i++) {
// 			const dataKey = drizzle.contracts.PatientRecord.methods["getRecord"].cacheCall(patientID, i);

// 			const storedData = PatientRecord.getRecord[dataKey];
// 			const record = (storedData && storedData.value);

// 			if (record) {
// 				const { 0: id, 1: title, 2: content } = record;

// 				const recordObject = {
// 					id: id,
// 					title: title,
// 					content: content
// 				}

// 				records.push(recordObject)
// 			}
// 		}
// 		updateRecords(records);

// 	}, [PatientRecord.getRecord, drizzle.contracts.PatientRecord.methods, patientID, recordCount])

// 	const columns = [
// 		{
// 			field: 'id',
// 			headerName: 'ID',
// 		},
// 		{
// 			field: 'title',
// 			headerName: 'Title',
// 			flex: 1,
// 		},
// 		{
// 			field: "",
// 			headerName: "Content",
// 			disableClickEventBubbling: true,
// 			disableColumnMenu: true,
// 			sortable: false,
// 			renderCell: (params) => {
// 				const thisRow = {};

// 				const handleClick = () => {
// 					const api = params.api;
// 					const fields = api
// 						.getAllColumns()
// 						.map((c) => c.field)
// 						.filter((c) => c !== "__check__" && !!c);


// 					fields.forEach((item) => {
// 						thisRow[item] = params.row[item] || '';
// 					});

// 					setSelectedRecord(thisRow);
// 					setOpen(true);
// 				}

// 				return (
// 					<div>
// 						<Button color="primary" onClick={handleClick}>View</Button>

// 					</div>
// 				);
// 			}
// 		},
// 	];

// 	return (
// 		<div style={{ height: 400, width: '100%' }}>
// 			{records.length !== 0 ?
// 				<DataGrid
// 					style={{ width: '640px' }}
// 					rows={records}
// 					columns={columns}
// 					pageSize={5}
// 					disableSelectionOnClick
// 				/> : 'Loading...'}
// 			<Dialog
// 				open={open}
// 				onClose={handleClose}
// 				aria-labelledby="record-dialog-title"
// 				aria-describedby="record-dialog-description"
// 			>
// 				<DialogTitle id="record-dialog-title">{"Title"} - {selectedRecord.title}</DialogTitle>
// 				<DialogContent>
// 					<DialogContentText id="record-dialog-description">
// 						{records.map(record => record.content)[selectedRecord.id - 1]}
// 					</DialogContentText>
// 				</DialogContent>
// 				<DialogActions>
// 					<Button onClick={handleClose} color="primary">
// 						Close
// 					</Button>
// 				</DialogActions>
// 			</Dialog>
// 		</div>

// 	);
// }

// export default DiagnosisList

import React, { useState, useEffect } from 'react'
import { Button, Table, TableCell, TableRow, TableBody, TableHead, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { GridToolbar } from '@material-ui/data-grid';

const DiagnosisList = ({ drizzle, drizzleState, patientID }) => {
	const { PatientRecord } = drizzleState.contracts;
	const [open, setOpen] = useState(false);

	const [selectedRecord, setSelectedRecord] = useState({
		id: '',
		title: '',
		content: '',
	});

	const [dataKeys, setDataKeys] = useState([]);

	useEffect(() => {

		async function fetchRecords() {
			const contract = drizzle.contracts.PatientRecord;
			const recordCount = await contract.methods.recordCount(patientID).call();
			const dataKeys = [];
			for (let i = 1;i <= recordCount;i++) {
				await dataKeys.push(contract.methods.getRecord.cacheCall(patientID, i));
			}
			setDataKeys(dataKeys);
		}

		fetchRecords();
	}, [])


	const recordList = dataKeys.map(key =>
		PatientRecord.getRecord[key] ? PatientRecord.getRecord[key].value : []
	);

	const handleClick = (record) => {
		setSelectedRecord({
			id: record[0],
			title: record[1],
			content: record[2]
		});
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false);
	};

	const rows = recordList.map(record => (
		<TableRow key={record[0]}>
			<TableCell>{record[0]}</TableCell>
			<TableCell>{record[1]}</TableCell>
			<TableCell align="right">
				<Button
					color="primary"
					variant="outlined"
					onClick={() => handleClick(record)}
				>
					View
				</Button>
			</TableCell>
		</TableRow>
	));



	return (
		<div style={{ height: 400, width: '100%' }}>
			{recordList.length === 0 ? 'Loading...' :
				<Table size="medium"
					components={{
						Toolbar: GridToolbar,
					}}
					pageSize={5}
				>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Title</TableCell>
							<TableCell align="right">Content</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>{rows}</TableBody>
				</Table>

			}
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="record-dialog-title"
				aria-describedby="record-dialog-description"
			>
				<DialogTitle id="record-dialog-title">{"Title"} - {selectedRecord.title}</DialogTitle>
				<DialogContent>
					<DialogContentText id="record-dialog-description">
						{selectedRecord.content}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default DiagnosisList
