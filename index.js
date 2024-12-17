const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config();
const Person = require("./models/person")

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify({"name":req.body.name, "number":req.body.number})
  ].join(' ')
}))

let data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
    const date = new Date()
    //console.log(express.responseTime())
    response.send(`
        <p>Phonebook has info for ${data.length} people</p>
        <p>${date.toString()}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = data.find(n => n.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    data = data.filter(n => n.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    //console.log(person.content)

    if (!person.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!person.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }
    if (data.find(n => n.name === person.name)) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }

    person.id = String(Math.floor(Math.random() * 10000000))

    data = data.concat(person)
  
    response.json(person)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)