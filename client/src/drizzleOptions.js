import PatientRecord from "./contracts/PatientRecord.json";
import DoctorStorage from "./contracts/DoctorStorage.json";

const options = {
    contracts: [PatientRecord, DoctorStorage],
    events: {
        PatientRecord: ['PatientCreated', 'RecordCreated'],
        DoctorStorage: ['DoctorCreated'],
    },
    web3: {
        fallback: {
            type: "ws",
            url: "ws://127.0.0.1:8545",
        },
    },
};

export default options;