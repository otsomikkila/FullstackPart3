const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

//console.log(process.argv)

const url = `mongodb+srv://otsomikkila:${password}@cluster0.syfz5.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 5) {
    const person = new Person({
        id: String(Math.floor(Math.random() * 10000000)),
        name: process.argv[3],
        number: process.argv[4]
    })
      
    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}
else {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
