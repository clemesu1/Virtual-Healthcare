// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

/// @title A storage method for hospital patients and medical records
/// @author Colin John LeMesurier

contract PatientRecord {
    uint256 public patientCount = 0;
    mapping(uint256 => uint256) public recordCount;

    struct Record {
        uint256 id;
        string title;
        string content;
    }

    struct Patient {
        uint256 id;
        string patient;
        uint256 key;
        mapping(uint256 => Record) records;
    }
    mapping(uint256 => Patient) public patients;
    uint256[] private patientIndex;

    event PatientCreated(uint256 id, string patient, uint256 recordCount);

    event RecordCreated(
        uint256 patientID,
        uint256 recordID,
        string title,
        string content
    );

    /**
     * Method to check if a patient already exisits in the blockchain
     *
     * @param key   the patients medicare number used as a key
     */
    function isPatient(uint256 key) public view returns (bool isIndeed) {
        if (patientIndex.length == 0) return false;
        for (uint256 i = 0; i < patientIndex.length; i++) {
            if (patientIndex[i] == key) return true;
        }
        return false;
    }

    /**
     * Create and store a patient's infomation in the blockchain
     * 
     * @param _patient   the patients information
     * @param key        the patients medicare number used as a key
     */
    function createPatient(string memory _patient, uint256 key) public {
        if(isPatient(key)) revert(); 
        patientCount++;
        Patient storage p = patients[patientCount];
        p.id = patientCount;
        p.patient = _patient;
        recordCount[patientCount] = 0;
        patientIndex.push(key);
        emit PatientCreated(patientCount, _patient, 0);
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
        recordCount[_id]++;
        Record storage r = p.records[recordCount[_id]];
        r.id = recordCount[_id];
        r.title = _title;
        r.content = _content;
        emit RecordCreated(_id, recordCount[_id], _title, _content);
    }

    /**
     * Returns a patient using their ID number as the index.
     *
     * @param index the index for the requested patient
     * @return      an object containing requested patient's data
     */
    function getPatient(uint256 index)
        public
        view
        returns (
            uint256,
            string memory,
            uint256
        )
    {
        Patient storage p = patients[index];
        return (p.id, p.patient, recordCount[index]);
    }

    /**
     * Returns a patient's record using the patient ID and record ID as the indices.
     *
     * @param pIndex       the index of the patient whose record is being requested
     * @param recordIndex  the index of the record requested
     * @return             the object of the record requested
     */
    function getRecord(uint256 pIndex, uint256 recordIndex)
        public
        view
        returns (
            uint256,
            string memory,
            string memory
        )
    {
        Patient storage p = patients[pIndex];
        return (
            p.records[recordIndex].id,
            p.records[recordIndex].title,
            p.records[recordIndex].content
        );
    }
}
