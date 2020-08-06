const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log(`give password as argument`)
    process.exit(1)
}

// salasana annetaan argumenttina komentorivilta
const password = process.argv[2]

// db:n nimi
// jos ei ole olemassa, niin MongoDB luo sellaisen
const dbName = "note-app"

const url = 
`mongodb+srv://tayspino:${password}@cluster0.ufxii.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// Uusia muistiinpanoja generoiva osa

// const note = new Note({
//     content: `00's called, they want their callback-functions back`,
//     date: new Date(),
//     important: true,
// })

// note.save().then(response => {
//     console.log(`note saved!`)
//     mongoose.connection.close()
// })

// ei hakuehtoa findin parametrina => haetaan kaikki
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})