const express = require('express')
const app = express()
const port = 3001

app.use(express.static('static'))

app.get('/', (req, res) => res.send('Hello World?'))
app.get('/test', (req, res) => res.send('TEST'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
