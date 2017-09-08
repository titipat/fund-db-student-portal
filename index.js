const _ = require('lodash')
const dotenv = require('dotenv').config()
const pug = require('pug')
const Sheet = require('./lib/sheet')
const { getSheet, getHeader, getScore } = Sheet
const Student = require('./lib/student')
const PASSWD = '1234'

const studentId = '580610631'
const students = [
  {
    id: '580610XXX',
    firstname: 'John',
    lastname: 'Doe',
    email: 'johndoe@example.com'
  }
]

const moment = require('moment')
let student = students.pop()
const jwt = require('jsonwebtoken')
student.iat = moment()
  .add(1, 'days')
  .unix()
const token = jwt.sign(student, process.env.JWT_SECRET)

const generateToken = student => {
  if (_.isEmpty(process.env.JWT_SECRET)) {
    throw new Error('process.env.JWT_SECRET is required')
  }
  student.iat = moment()
    .add(1, 'days')
    .unix()
  const token = jwt.sign(student, process.env.JWT_SECRET)
  return token
}

const express = require('express')
const helmet = require('helmet')
let app = express()

app.use(helmet())

app.get('/me/scoreboard', (req, res) => {
  const token = req.query.token
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.sendStatus(403)
    }
    // res.json(payload)
    getScore(payload.id, (err, score) => {
      const student = {
        id: score.id.value,
        firstname: score.firstname.value.toString('utf8'),
        lastname: score.lastname.value
      }
      // console.log(score);
      const fs = require('fs')
      const html = pug.renderFile('template.pug', {
        student,
        score
      })
      // console.log(html)
      res.send(html)
    })
  })
})

app.get('/students/:id', (req, res) => {
  const { id } = req.params
  Student.find(id, (err, student) => {
    if (err) {
      console.error(err)
      if (err.toString() === 'Error: Student not found') {
        return res.sendStatus(404)
      }
    }
    res.json(student)
  })
})

const bodyParser = require('body-parser')

app.post(
  '/authenticate',
  [bodyParser.urlencoded({ extended: false }), bodyParser.json()],
  (req, res) => {
    const { email, id } = req.body

    if (_.isEmpty(email) || _.isEmpty(id)) {
      console.error(`Authenticating:`, id, email)
      return res.sendStatus(400)
    }

    Student.find(id, (err, student) => {
      if (err) {
        if (
          err.toString() === 'Student not found' ||
          err.toString() === 'Email mapping not found'
        ) {
          return res.sendStatus(403)
        }
      }

      if (student.id !== id || student.email !== email) {
        return res.sendStatus(403)
      }

      const token = generateToken(student)
      res.send(`Here is your token: ${token}`)
    })
  }
)

app.use((req, res) => {
  res.send('m/a')
})

app.listen(process.env.PORT || 3000)
