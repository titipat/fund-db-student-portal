const _ = require("lodash")
const dotenv = require("dotenv").config()
const pug = require("pug")
const sheet = require('./lib/sheet')
const {getSheet, getHeader, getScore} = sheet

const studentId = "580610631"
const students = [
  {
    id: "580610631",
    firstname: "Titipat",
    lastname: "Sukhvibul",
    email: "titipatsukhvibul@gmail.com"
  }
]

const moment = require("moment")
let student = students.pop()
const jwt = require("jsonwebtoken")
student.iat = moment()
  .add(1, "days")
  .unix()
const token = jwt.sign(student, process.env.JWT_SECRET)
// console.log(token)

// const student = students.pop()

const express = require("express")
let app = express()

app.get("/myscoreboard", (req, res) => {
  const token = req.query.token
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.sendStatus(403)
    }
    // res.json(payload)
    getScore(payload.id, (err, score) => {
      const student = {
        id: score.id.value,
        firstname: score.firstname.value.toString("utf8"),
        lastname: score.lastname.value
      }
      // console.log(score);
      const fs = require("fs")
      const html = pug.renderFile("template.pug", {
        student,
        score
      })
      // console.log(html)
      res.send(html)
    })
  })
})

app.get('/students/:id', (req, res) => {
  const {id} = req.params
  getScore(id, (err, score) => {
    if (err) {
      console.error(err)
      if (err.toString() === 'Error: Student not found') {
        return res.sendStatus(404)
      }
    }
    res.json(score)
  })
})

app.use((req, res) => {
  res.send("m/a")
})

app.listen(process.env.PORT || 3000)
