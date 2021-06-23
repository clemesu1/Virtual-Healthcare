const PatientRecord = artifacts.require("./PatientRecord.sol")

contract('PatientRecord', (accounts) => {
    before(async() => {
        this.patientRecord = await PatientRecord.deployed()
    })

    it('deploys successfully', async() => {
        const address = await this.patientRecord.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('lists patients', async() => {
        const patientCount = await this.patientRecord.patientCount()
        const patient = await this.patientRecord.patients(patientCount)
        const recordCount = await this.patientRecord.recordCount(patientCount);

        assert.equal(patient.id.toNumber(), patientCount.toNumber())
        assert.equal(patient.name, 'John Doe', "name is not equal")
        assert.equal(patient.medicare, '111111111', "medicare is not equal")
        assert.equal(recordCount.toNumber(), 1, "record count is not equal")
        assert.equal(patientCount.toNumber(), 1, "patient count is not equal")
    })

    it('lists records', async() => {
        const patientCount = await this.patientRecord.patientCount()
        const recordCount = await this.patientRecord.recordCount(patientCount)

        // must call `getRecord` function from smart contract to get record data.
        const record = await this.patientRecord.getRecord(patientCount.toNumber(), recordCount.toNumber())

        /// @notice: patient data access uses dot, record data access uses array index.
        const { 0: recordID, 1: recordTitle, 2: recordContent } = record;
        assert.equal(recordID.toNumber(), recordCount.toNumber(), `record id and record count are not equal`)
        assert.equal(recordTitle, 'Title', "record title is not equal")
        assert.equal(recordContent, 'Content', "record content is not equal")
        assert.equal(recordCount.toNumber(), 1, "record count is not equal")
    })

    it('creates patients', async() => {
        const result = await this.patientRecord.createPatient('A new patient', '222222222')
        const patientCount = await this.patientRecord.patientCount()
        assert.equal(patientCount, 2)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.name, 'A new patient')
        assert.equal(event.medicare, '222222222')
        assert.equal(event.recordCount.toNumber(), 0)
    })

    it('creates records', async() => {
        const result = await this.patientRecord.createRecord(1, 'Title2', 'Content2')
        const recordCount = await this.patientRecord.recordCount(1);
        assert.equal(recordCount, 2)
        const event = result.logs[0].args
        assert.equal(event.patientID.toNumber(), 1)
        assert.equal(event.recordID.toNumber(), 2)
        assert.equal(event.title, 'Title2')
        assert.equal(event.content, 'Content2')
    })

})