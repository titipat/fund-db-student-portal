const Student = require('../lib/student')
jest.setTimeout(10000)

describe('mapEmail', () => {
  test('should return email', done => {
    Student.mapEmail('580610XXX', (err, email) => {
      expect(err).toBeNull()
      expect(email).not.toBeNull()
      done()
    })
  })
})
describe('find()', () => {
  test('should return student record', done => {
    Student.find('580610XXX', (err, student) => {
      expect(err).toBeNull()
      expect(student).toEqual({
        id: '580610XXX',
        firstname: 'John',
        lastname: 'Doe',
        email: 'johndoe@example.com',
        scores: [
          {
            label: 'lab 1',
            value: 49,
            fullMark: 50,
            type: 'number'
          },
          {
            label: 'lab 2',
            value: 56,
            fullMark: 57,
            type: 'number'
          },
          {
            label: 'lab 3',
            value: 54,
            fullMark: 55,
            type: 'number'
          }
        ]
      })
      done()
    })
  })
})
