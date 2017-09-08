const dotenv = require('dotenv').config({ path: `${__dirname}/../.env` })
const _ = require('lodash')
const google = require('googleapis')
const sheets = google.sheets('v4')

if (_.isEmpty(process.env.GOOGLE_SERVICE_ACCOUNT)) {
  throw new Error('GOOGLE_SERVICE_ACCOUNT is required')
}
const GOOGLE_SERVICE_ACCOUNT = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, 'base64').toString()
)

if (_.isEmpty(process.env.SPREAD_SHEET_ID)) {
  throw new Error('SPREAD_SHEET_ID is required')
}
const SPREAD_SHEET_ID = process.env.SPREAD_SHEET_ID

const jwtClient = new google.auth.JWT(
  GOOGLE_SERVICE_ACCOUNT.client_email,
  null,
  GOOGLE_SERVICE_ACCOUNT.private_key,
  ['https://www.googleapis.com/auth/spreadsheets.readonly'], // an array of auth scopes
  null
)

const getSheet = (sheetName, callback) => {
  jwtClient.authorize((err, tokens) => {
    if (err) {
      console.error(err)
    }

    const req = {
      spreadsheetId: SPREAD_SHEET_ID,
      auth: jwtClient,
      range: [sheetName]
    }
    sheets.spreadsheets.values.get(req, (err, sheet) => {
      callback(err, sheet)
    })
  })
}

const getHeader = callback => {
  getSheet('summary', (err, sheet) => {
    // console.log(sheet)
    callback(err, {
      labels: sheet.values[0],
      fullMarks: sheet.values[1]
    })
  })
}

const getScore = (studentId, callback) => {
  getSheet('summary', (err, sheet) => {
    getHeader((err, header) => {
      const score = sheet.values
        .filter(record => {
          return record[1] == studentId
        })
        .pop()

      if (_.isEmpty(score)) {
        return callback(new Error('Student not found'))
      }

      let response = {}
      for (const index in header.labels) {
        response[header.labels[index]] = {
          value: score[index]
        }

        if (header.fullMarks[index].length > 0) {
          response[header.labels[index]].fullMark = _.toNumber(
            header.fullMarks[index]
          )
          response[header.labels[index]].type = 'number'
        } else {
          response[header.labels[index]].type = 'string'
        }
      }

      callback(err, response)
    })
  })
}

module.exports = { getSheet, getHeader, getScore }
