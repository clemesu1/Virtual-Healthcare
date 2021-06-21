// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

/// @title A storage method for hospital patients and medical records
/// @author Colin John LeMesurier

contract PatientRecord {
    uint256 public patientCount = 0;

    struct Record {
        uint256 id;
        string title;
        string content;
    }

    struct Patient {
        uint256 id;
        string name;
        string medicare;
        uint256 recordCount;
        mapping(uint256 => Record) records;
    }

    mapping(uint256 => Patient) public patients;

    event PatientCreated(
        uint256 id,
        string name,
        string medicare,
        uint256 recordCount
    );
    event RecordCreated(
        uint256 patientID,
        uint256 recordID,
        string title,
        string content
    );

    constructor() public {
        createPatient("John Doe", "111111111");
        createRecord(1, "Title", "Content");
    }

    /**
     * Creates a patient with an ID, name, and medicare number,
     * and initializes the record count of the patient to 0.
     *
     * @param _name       the name of the patient
     * @param _medicare   the medicare number of patient
     */
    function createPatient(string memory _name, string memory _medicare)
        public
    {
        if (patientCount > 0) {
            for (uint256 i = 0; i < patientCount; i++) {
                if (
                    keccak256(abi.encodePacked(patients[i].medicare)) !=
                    keccak256(abi.encodePacked(_medicare))
                ) {
                    revert("Patient with that medicare number already exists.");
                }
            }
        }

        Patient storage p = patients[++patientCount];
        p.id = patientCount;
        p.name = _name;
        p.medicare = _medicare;
        p.recordCount = 0;
        emit PatientCreated(patientCount, _name, _medicare, 0);
    }

    /**
     * Create a record for a patient specified by ID.
     *
     * @param _id      the ID of the patient
     * @param _title   the title of the record entry
     * @param _content the content of the record entry
     */
    function createRecord(
        uint256 _id,
        string memory _title,
        string memory _content
    ) public {
        // TODO: switch from using id to medicare number for creating records.
        //		 **perhaps get ID via medicare number.
        Patient storage p = patients[_id];
        Record storage r = p.records[++p.recordCount];
        r.id = p.recordCount;
        r.title = _title;
        r.content = _content;
        emit RecordCreated(_id, p.recordCount, _title, _content);
    }

    /**
     * Returns a patient using their ID number as the index.
     *
     * @param index the index for the requested patient
     * @return      the object containing requested patient's data
     */
    function getPatient(uint256 index)
        public
        view
        returns (
            uint256,
            string memory,
            string memory
        )
    {
        return (
            patients[index].id,
            patients[index].name,
            patients[index].medicare
        );
    }

    /**
     * Returns a patient's record using the patient ID and record ID as the indices.
     *
     * @param patientIndex the index of the patient whose record is being requested
     * @param recordIndex  the index of the record requested
     * @return             the object of the record requested
     */
    function getRecord(uint256 patientIndex, uint256 recordIndex)
        public
        view
        returns (
            uint256,
            string memory,
            string memory
        )
    {
        Patient storage p = patients[patientIndex];
        return (
            p.records[recordIndex].id,
            p.records[recordIndex].title,
            p.records[recordIndex].content
        );
    }
}
