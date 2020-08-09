const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const Users = require('./client/src/Users.json')
const PDD = require('./client/src/Paintings.json')
const Loc = require('./client/src/Locations.json');
const Tax = require('./client/src/Tax.json')
const { promisify } = require('util');

const app = express();
const port = process.env.PORT || 5000;
const upload = multer()
const pipeline = promisify(require("stream").pipeline)

const cors = require('cors')
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/users', (req, res) => {
  console.log('')
  console.log('-------------------')
  console.log('')
  console.log('Users file sent')
  console.log('')
  res.send({ Users });
});

app.get('/api/database-info', (req, res) => {
  console.log('-------------------')
  console.log('')
  console.log('Database file sent')
  console.log('')
  res.send({ PDD })
})

app.get('/api/database-places', (req, res) => {
  console.log('-------------------')
  console.log('')
  console.log('Locations file sent')
  console.log('')
  res.send({ Loc })
})

app.get('/api/database-tax', (req, res) => {
  console.log('-------------------')
  console.log('')
  console.log('Tax file sent')
  console.log('')
  res.send({ Tax })
})

app.post('/api/delete', async (req, res) => {
  console.log('-------------------')
  console.log('')
  console.log(req.body)
  console.log('')
  const num = parseInt(req.body.num)
  const len = Object.keys(PDD).length
  console.log(PDD[num]['file'])
  await fs.unlink('./client/src/Paintings/' + PDD[num]['file'], (err) => {
    if (err) throw err
  })
  for (var i = num; i < len; i++) {
    PDD[i] = PDD[i + 1]
  }
  if (num + 1 === len) {
    delete PDD[num]
  }
  const poster = JSON.stringify(PDD, null, 4)
  fs.writeFile('./client/src/Paintings.json', poster, (err) => {
    if (err) throw err
    console.log('-------------------')
    console.log('')
    console.log('Painting deleted')
    console.log('')
    res.send('Deleted')
  })
})

app.post('/api/edit/loc', (req, res) => {
  console.log('-------------------')
  console.log('')
  const {
    code,
    rate
  } = req.body
  console.log(req.body)
  console.log('')
  Tax[code] = rate
  const poster = JSON.stringify(Tax, null, 4)
  fs.writeFile('./client/src/Tax.json', poster, (err) => {
    if (err) throw err
    console.log('-------------------')
    console.log('')
    console.log('Location updated')
    console.log('')
    res.send('Updated')
  })
})

app.post('/api/edit', (req, res) => {
  console.log('-------------------')
  console.log('')
  const {
    name,
    type,
    on,
    location,
    sold,
    file,
    price,
    year,
    sub,
    width,
    height,
    num,
    frame,
    tax,
    left,
    rate,
    paid
  } = req.body
  console.log(req.body)
  console.log('')
  var add
  if (a.rate) {
    add = {
      "name": name,
      "type": type,
      "on": on,
      "location": location,
      "sold": (sold === 'true' || sold === true),
      "file": file,
      "price": parseInt(price),
      "sub": sub,
      "year": parseInt(year),
      "frame": (frame === 'true' || frame === true),
      "size": {
        "height": parseInt(height),
        "width": parseInt(width)
      },
      "tax": parseInt(tax),
      "left": parseInt(left),
      "rate": parseInt(rate),
      "paid": (paid === 'true' || paid === true),

    }
  } else {
    add = {
      "name": name,
      "type": type,
      "on": on,
      "location": location,
      "sold": (sold === 'true' || sold === true),
      "file": file,
      "price": parseInt(price),
      "sub": sub,
      "year": parseInt(year),
      "frame": (frame === 'true' || frame === true),
      "size": {
        "height": parseInt(height),
        "width": parseInt(width)
      }
    }
  }
  PDD[num] = add
  const poster = JSON.stringify(PDD, null, 4)
  fs.writeFile('./client/src/Paintings.json', poster, (err) => {
    if (err) throw err
    console.log('-------------------')
    console.log('')
    console.log('Painting updated')
    console.log('')
    res.send('Updated')
  })
})

app.post('/api/add/user', (req, res) => {
  const {
    username,
    password,
    admin
  } = req.body
  console.log('-------------------')
  console.log('')
  console.log(req.body)
  console.log('')
  const data = Object.keys(Users).length
  const add = {
    'username': username,
    'password': password,
    'admin': (admin === 'true' || admin === true)
  }
  Users[data] = add
  const poster = JSON.stringify(Users, null, 4)
  fs.writeFile('./client/src/Users.json', poster, (err) => {
    if (err) throw err
    console.log('-------------------')
    console.log('')
    console.log('User added')
    console.log('')
    res.send('Added')
  })
})

app.post('/api/add/loc', (req, res) => {
  const {
    name,
    code,
    rate
  } = req.body
  console.log('-------------------')
  console.log('')
  console.log(req.body)
  console.log('')
  Loc[code.toUpperCase()] = name
  Tax[code.toUpperCase()] = parseInt(rate)
  res.send('Added')
})

app.post('/api/add/painting',upload.single("image"), async (req, res) => {
  console.log('-------------------')
  console.log('this:  ')
  const File = req.file
  const name = req.body.name
  const a = req.body
  console.log(a)
  console.log('')
  if (File.detectedFileExtension === '' || File.detectedFileExtension != File.clientReportedFileExtension) res.send('invalid file type')
  const fileName = name + '@f' + File.originalName
  console.log(fileName)
  await pipeline(File.stream, fs.createWriteStream(`${__dirname}/client/src/Paintings/${fileName}`))
  const num = Object.keys(PDD).length
  var add = {
    "name": name,
    "type": type,
    "on": on,
    "location": location,
    "sold": (sold === 'true' || sold === true),
    "file": file,
    "price": parseInt(price),
    "sub": sub,
    "year": parseInt(year),
    "frame": (a.frame === 'true' || a.frame === true),
    "size": {
      "width": parseInt(width),
      "height": parseInt(height)
    }
  }
  PDD[num] = add
  const poster = JSON.stringify(PDD, null, 4)
  fs.writeFile('./client/src/Paintings.json', poster, (err) => {
    if (err) throw err
    console.log('-------------------')
    console.log('')
    console.log('Painting added')
    console.log('')
    res.send('Added')
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`));