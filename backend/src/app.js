const express = require('express');
const path = require('path');
const fs = require('fs');




const app = express();


//console.log("Looking for public folder at:", path.join(__dirname, '../public'));
const publicPath = path.join(__dirname, '../public');
console.log("Looking exactly here:", publicPath);
console.log("Files found inside:", fs.readdirSync(publicPath));

// Your existing static line should be right here:
app.use(express.static(publicPath));
app.use(express.static(path.join(__dirname,'public')));
app.get("/",(req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;


