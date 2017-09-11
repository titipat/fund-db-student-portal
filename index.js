const _ = require('lodash')
require('dotenv').config()
const pug = require('pug')
const Sheet = require('./lib/sheet')
const { getScore } = Sheet
const Student = require('./lib/student')

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
      if (err) {
        console.error('Can not get student score')
        return res.sendStatus(500)
      }
      const student = {
        id: score.id.value,
        firstname: score.firstname.value.toString('utf8'),
        lastname: score.lastname.value
      }
      // console.log(score);
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
const sendMail = (option, callback) => {
  const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: option.recipient
            }
          ],
          subject: 'Sending with SendGrid is Fun'
        }
      ],
      from: {
        email: 'noreply@titipat.net'
      },
      content: [
        {
          type: 'text/plain',
          value: option.content
        }
      ]
    }
  })
  sg.API(request, (err, response) => {
    callback(err, response)
  })
}

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
      // res.send(`Here is your token: ${token}`)
      const option = {
        recipient: student.email,
        content: `Please visit: https://fund-db-student-portal.herokuapp.com/me/scoreboard?token=${token}`
      }
      sendMail(option, (err, result) => {
        if (err) {
          return res.sendStatus(500)
        }

        res.send('We sent the token to your email.')
      })
    })
  }
)

app.use((req, res) => {
  res.send('m/a')
})

app.listen(process.env.PORT || 3000)
