const Sheet = require('./sheet')
const _ = require('lodash')
const mapEmail = (studentId, callback) => {
  Sheet.getSheet('email', (err, sheet) => {
    const record = sheet.values.find(item => {
      return item[0] === studentId
    })

    if (_.isEmpty(record)) {
      return callback(new Error('Email mapping not found'))
    }

    // console.log(`Found ${record[1]}`)
    callback(null, record[1])
  })
}
const find = (studentId, callback) => {
  Sheet.getSheet('summary', (err, sheet) => {
    mapEmail(studentId, (err, email) => {
      if (err) {
        return callback(err)
      }

      const beginLabel = 4
      const endLabel = 6
      const record = sheet.values.find(item => {
        return item[1] === studentId
      })

      if (_.isEmpty(record)) {
        console.error(`Student ${studentId} not found`)
        return callback(new Error('Student not found'))
      }

      let scores = []

      for (let i = beginLabel; i <= endLabel; i++) {
        scores.push({
          label: sheet.values[0][i],
          value: _.toNumber(record[i]),
          type: _.isFinite(_.toNumber(record[i])) ? 'number' : 'other',
          fullMark: _.toNumber(sheet.values[1][i])
        })
      }

      const student = {
        id: record[1],
        firstname: record[2],
        lastname: record[3],
        email,
        scores
      }

      callback(err, student)
    })
  })
}

module.exports = { find, mapEmail }
