import PatientRecord from "./contracts/PatientRecord.json";

const options = {
    contracts: [PatientRecord],
    events: {
        PatientRecord: ['PatientCreated', 'RecordCreated'],
    },
    web3: {
        fallback: {
            type: "ws",
            url: "ws://127.0.0.1:8545",
        },
    },
};

export default options;