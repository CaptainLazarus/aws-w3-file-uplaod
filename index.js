const fs = require('fs');
const AWS = require('aws-sdk');
const express = require('express');
const parser = require('body-parser');
const fileUpload = require('express-fileupload');
require("dotenv").config();

app = express();
app.use(fileUpload());
app.use(express.static(__dirname + '/public'));
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

function uploadForm(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let files = req.files.sampleFile;
    console.log(files);
    console.log(files.length);
    // res.send(files);

    for(i=0 ; i<files.length ; i++){
        let params = {
            Bucket: 'mk-file-upload',
            Key: `${files[i].name}`,
            // ContentType: "image/png;charset=utf-8",
            Body: JSON.stringify(files[i].data, null, 2)
        };
    
        s3.putObject(params, (err , data) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log(`${files[i].name} stored\n`);
                // res.send("Cool");
            }
        });
    }

    res.send("Cool");
};


app.get('/', (req, res) => {
    res.render('index');
});

app.post("/", (req, res) => {
    uploadForm(req, res);
});

app.listen(3000);
