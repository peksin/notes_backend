require('dotenv').config()
const express = require('express')
const { response } = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')
const { update } = require('./models/note')

const requestLogger = (request, response, next) => {
    console.log(`Method:`, request.method)
    console.log(`Path:  `, request.path)
    console.log(`Body:  `, request.body)
    console.log(`----------`)
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

// middlewaret kayttoon
app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2020-01-10T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2020-01-10T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2020-01-10T19:20:14.298Z",
      important: true
    }
]

const generateId = () => {
    // ...notes levittaa taulukon luvuiksi maxia varten
    // Math.maxille ei kelpaa taulukollinen lukuja!
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

/*==========================
 * Routet tanne
 *=========================*/

 // add one note
app.post('/api/notes', (request, response, next) => {
    const body = request.body

    if (body.content === undefined) {
        // 400 bad request
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note
        .save()
        .then(savedNote => savedNote.toJSON())
        .then(savedAndFormattedNote => {
            res.json(savedAndFormattedNote)
        })
        .catch(error => next(error))
})

// get a useless hello world
app.get('/', (req, res) => {
    res.send('<h1>Hello Worldi!</h1>')
})

// get all
app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

// get one note
app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// delete one note
app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// update one note
app.put('/api/notes/:id', (req, res, next) => {
    const body = req.body

    const note = {
        content: body.content,
        important: body.important,
    }

    // new:true -> handleri saa parametrikseen updatedNote muutoksen
    // JALKEEN. Muuten saisi ennen muutosta...
    Note.findByIdAndUpdate(req.params.id, note, {new: true})
        .then(updatedNote => {
            res.json(updatedNote)
        })
        .catch(error => next(error))
})

// Tama middleware tanne jotta se tulee kayttoon vasta jos HTTP-pyynto
// ei mennyt millekaan routelle hoitoon
app.use(unknownEndpoint)


// virheiden kasittelija
const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

// Palvelin kayntiin
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})