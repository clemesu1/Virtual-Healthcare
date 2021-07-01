const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors());

app.use('/doctor-login', (req, res) => {
    res.send({
        token: 'doctor-token'
    });
});

app.use('/patient-login', (req, res) => {
    res.send({
        token: 'patient-token'
    });
});


app.listen(8080, () => console.log('API is running on http://localhost:8080/doctor-login and http://localhost:8080/patient-login'));