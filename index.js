const google = require("googleapis");
const sheets = google.sheets("v4");
const _ = require("lodash");
const dotenv = require("dotenv").config();
const KEY = JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, 'base64').toString())
const pug = require("pug");
const SPREAD_SHEET_ID = process.env.SPREAD_SHEET_ID;

if (_.isEmpty(SPREAD_SHEET_ID)) {
  throw new Error("SPREAD_SHEET_ID is required");
}

const jwtClient = new google.auth.JWT(
  KEY.client_email,
  null,
  KEY.private_key,
  ["https://www.googleapis.com/auth/spreadsheets.readonly"], // an array of auth scopes
  null
);

const getSheet = callback => {
  jwtClient.authorize((err, tokens) => {
    if (err) {
      console.error(err);
    }

    const req = {
      spreadsheetId: SPREAD_SHEET_ID,
      auth: jwtClient,
      range: ["summary"]
    };

    sheets.spreadsheets.values.get(req, (err, res) => {
      callback(err, res);
      // if (err) {
      //     console.error(err)
      // }
      // console.log(res)
    });
  });
};

// getSheet((err, sheet) => {
// console.log(sheet)
// })

const getHeader = callback => {
  getSheet((err, sheet) => {
    // console.log(sheet)
    callback(err, {
      labels: sheet.values[0],
      fullMarks: sheet.values[1]
    });
  });
};

const getScore = (studentId, callback) => {
  getSheet((err, sheet) => {
    getHeader((err, header) => {
      const score = sheet.values
        .filter(record => {
          return record[1] == studentId;
        })
        .pop();

      let response = {};
      for (const index in header.labels) {
        response[header.labels[index]] = {
          value: score[index]
        };

        if (header.fullMarks[index].length > 0) {
          response[header.labels[index]].fullMark = _.toNumber(
            header.fullMarks[index]
          );
          response[header.labels[index]].type = "number";
        } else {
          response[header.labels[index]].type = "string";
        }
      }

      callback(err, response);
    });
  });
};

const studentId = "580610631";
// getScore(studentId, (err, score) => {
//   const student = {
//     id: score.id.value,
//     firstname: score.firstname.value.toString("utf8"),
//     lastname: score.lastname.value
//   };
//   console.log(score);
//   const fs = require("fs");
//   const html = pug.renderFile("template.pug", {
//     student,
//     score
//   });
//   // console.log(html)
//   fs.writeFileSync("./output.html", html);
// });

const students = [
  {
    id: "580610631",
    firstname: "Titipat",
    lastname: "Sukhvibul",
    email: 'titipatsukhvibul@gmail.com'
  }
];

const moment = require('moment')
let student = students.pop()
const jwt = require('jsonwebtoken')
student.iat = moment().add(1, 'days').unix()
const token = jwt.sign(student, process.env.JWT_SECRET)
// console.log(token)

// const student = students.pop()

const express = require('express')
let app = express()
app.use((req, res) => {
  res.send('m/a')
})
app.listen(process.env.PORT || 3000)