// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

/// @title A storage method for doctor account information
/// @author Colin John LeMesurier

contract DoctorStorage {
	uint public doctorCount = 0;

	struct Doctor {
		uint id;
		string name;
		string email;
		string password;
	}

	mapping(uint => Doctor) doctors;
	string[] private doctorIndex;

	event DoctorCreated(uint id, string name, string email, string password);

	/**
	 * Check whether a doctor with the same email already exists in the system
	 *
	 * @param key   the doctor's email
	 */
	function isDoctor(string memory key) public view returns (bool isIndeed) {
		if (doctorIndex.length == 0) return false;
		for (uint i = 0; i < doctorIndex.length; i++) {
			if (keccak256(abi.encodePacked((doctorIndex[i]))) == keccak256(abi.encodePacked((key)))) return true;
		}
	}

	/**
	 * Create an account for a doctor and store the information on the blockchain
	 *
	 * @param _name       the doctor's name
	 * @param _email      the doctor's email
	 * @param _password   the doctor's account password
	 */
	function createDoctor(string memory _name, string memory _email, string memory _password) public {
		require(!isDoctor(_email), "Doctor already exists");
		doctorCount++;
		Doctor storage d = doctors[doctorCount];
		d.id = doctorCount;
		d.name = _name;
		d.email = _email;
		d.password = _password;
		doctorIndex.push(_email);
		emit DoctorCreated(doctorCount, _name, _email, _password);
		
	}

	/**
     * Returns a doctor using their ID number as the index.
     *
     * @param index   the index for the requested doctor
     * @return        an object containing requested doctor's data
     */
	function getDoctor(uint index) public view returns (uint, string memory, string memory, string memory) {
		Doctor storage d = doctors[index];
		return (d.id, d.name, d.email, d.password);
	}

}