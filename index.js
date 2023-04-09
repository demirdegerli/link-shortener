const express = require('express')
const app = express()
const fs = require("fs")
const { QuickDB } = require('quick.db')
const db = new QuickDB()
const hbs = require('express-hbs')
const sentences = require('./sentences.json')

// save data to database
async function dbset(key, value) {
  await db.set(key, value)
}
// get data from database
async function dbget(key) {
  return await db.get(key)
}
// is database has data
async function dbhas(key) {
  return await db.has(key)
}
// get all data from database
async function dball() {
  return await db.all()
}

  app.use(express.urlencoded({ extended: true }));
  app.set('view engine', 'hbs')

const urlregex = /(https?:\/\/)(.*\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))/g;

  function isValidUrl(string) {
  return urlregex.test(string)
    }
  
  app.get("/", async (req, res) => {
      sentences.output = ''
      res.render(__dirname + "/" + "page.hbs", sentences)
  })
  
  app.post('/', async (req, res) => {
      if(!req.body.link) return
      if(!(req.body.link.toLowerCase().startsWith("http://") || req.body.link.toLowerCase().startsWith("https://"))) req.body.link = "http://" + req.body.link
      if(!isValidUrl(req.body.link) && !isValidUrl(req.body.link)) {
        sentences.output = sentences.invalid
        res.status(422).render(__dirname + "/" + "page.hbs", sentences)
        return
      }
      let all = await dball()
      let linkstatus = all.find(d => d.data === req.body.link) ? all.find(d => d.data === req.body.link).ID : false
      if(linkstatus) {
        sentences.output = sentences.link.replace("%context%", `<a href=//${req.hostname+'/'+linkstatus}>${req.hostname+'/'+linkstatus}</a>`)
        res.render(__dirname + "/" + "page.hbs", sentences)
        return
      }
      let random = Math.random().toString(36).slice(-8)
      do {
        random = Math.random().toString(36).slice(-8)
      } while (await dbhas(random))
      await dbset(random, req.body.link)
      sentences.output = sentences.link.replace("%context%", `<a href=//${req.hostname+'/'+random}>${req.hostname+'/'+random}</a>`)
      res.render(__dirname + "/" + "page.hbs", sentences)
  })

  app.get('/style.css', (_, res) => {
    res.sendFile(__dirname + "/" + "style.css");
  });
  app.get('/script.js', (_, res) => {
    res.sendFile(__dirname + "/" + "script.js");
  });
  app.get('/icon.png', (_, res) => {
    res.sendFile(__dirname + "/" + "icon.png");
  });
  
  app.get('/:shortcode', async (req, res) => {
      if(!req.params || !req.params.shortcode) return
      if(!await dbhas(req.params.shortcode)) return res.status(404).render(__dirname + "/" + "error.hbs", sentences)
      res.redirect(await dbget(req.params.shortcode))
  })
  
  var listener = app.listen(80, async () => {
    console.log(`Server running on http(s)://${listener.address().address}:${listener.address().port} (${listener.address().family})`)
  });
