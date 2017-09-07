const google = require('googleapis')
const sheets = google.sheets('v4')
const _ = require('lodash')
const key = require('./key.json')
const dotenv = require('dotenv').config()
const SPREAD_SHEET_ID = process.env.SPREAD_SHEET_ID

if (_.isEmpty(SPREAD_SHEET_ID)) {
    throw new Error('SPREAD_SHEET_ID is required')
}

const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/spreadsheets.readonly'], // an array of auth scopes
    null
)

const getSheet = (callback) => {
    jwtClient.authorize((err, tokens) => {
        if (err) {
            console.error(err)
        }
    
        const req = {
            spreadsheetId: SPREAD_SHEET_ID,
            auth: jwtClient,
            range: ['summary']
        }
    
        sheets.spreadsheets.values.get(req, (err, res) => {
            callback(err, res)
            // if (err) {
            //     console.error(err)
            // }
            // console.log(res)
        })
    })
}

// getSheet((err, sheet) => {
    // console.log(sheet)
// })

const getHeader = (callback) => {
    getSheet((err, sheet) => {
        // console.log(sheet)
        callback(err, {
            labels: sheet.values[0],
            maximum: sheet.values[1]
        })
    })
}

const getScore = (studentId, callback) => {
    getSheet((err, sheet) => {
        getHeader((err, header) => {
            const score = sheet.values.filter((record) => {
                return record[1] == studentId
            }).pop()

            let response = {

            }
            for (const index in header.labels) {
                response[header.labels[index]] = {
                    value: score[index]
                }

                // console.log(_.toFinite(+header.maximum[index]))
                if (header.maximum[index].length > 0) {
                    response[header.labels[index]].maximum = _.toNumber(header.maximum[index])
                    response[header.labels[index]].type = 'number'
                } else {
                    response[header.labels[index]].type = 'string'
                }
            }

            callback(err, response)
        })
        
    })
}

const studentId = '580610631'
getScore(studentId, (err, score) => {
    console.log(score)
})