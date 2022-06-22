const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

//make sum function



app.listen(PORT, () => {
    console.log(`app listen at port ${PORT}`)
})