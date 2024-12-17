const express = require('express')
const app = express()
app.use(express.json())

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
    response.json(data)
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
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)