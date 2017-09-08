const Sheet = require('./sheet')
const _ = require('lodash')
const find = (studentId, callback) => {
    Sheet.getSheet('summary', (err, sheet) => {
        const beginLabel = 4
        const endLabel = 6
        const record = sheet.values.filter(item => {
            return item[1] === studentId
        }).pop()

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
            scores
        }

        callback(err, student)
    })
}

module.exports = {find}