const Student = require('../lib/student')
jest.setTimeout(10000)
describe('find()', () => {
  it('should return student record', done => {
    Student.find('580610631', (err, student) => {
      expect(err).toBeNull()
      expect(student).toEqual({
        id: '580610631',
        firstname: 'นายชวศิษฐ์',
        lastname: 'เต็งไตรรัตน์',
        scores: [
          {
            label: 'lab 1',
            value: 46,
            fullMark: 50,
            type: 'number'
          },
          {
            label: 'lab 2',
            value: 56.5,
            fullMark: 57,
            type: 'number'
          },
          {
            label: 'lab 3',
            value: 55,
            fullMark: 55,
            type: 'number'
          }
        ]
      })
      done()
    })
  })
})
