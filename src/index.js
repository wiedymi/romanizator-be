import express from 'express'
import bodyParser from 'body-parser'
import busboy from 'connect-busboy'
import { romanize } from './romanizator'

const app = new express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(busboy({ immediate: true }))

const romanizer = async (req, res) => {
  return req.busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    file.on('data', async stream => {
      const result = await romanize(stream.toString())

      return res.json({ filename, result })
    })
  })
}

app.post('/romanizer', romanizer)
app.get('/*', express.static('public'))

app.listen(4030, () => {
  console.log('server is working')
})
