const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs'); // import built in node modules fs and path 
const path = require('path');
const uuid= require('uuid');

app.use(bodyParser.json());

let topMiyazakiMovies = [
    {
      title: 'My Neighbor Totoro',
      genre: ['anime', 'fantasy', 'family'],
      year: '1988',
      director: 'Hayao Miyazaki',
    },
    {
      title: 'Kiki\'s Delivery Service',
      genre: ['anime', 'fantasy', 'adventure'],
      year: '1989',
      director: 'Hayao Miyazaki'
    },
    {
      title: 'Ponyo',
      genre: ['anime', 'violence'],
      year: '2008',
      director: 'Hayao Miyazaki',
    },
    {
      title: 'Howl\'s Moving Castle',
      genre: ['fantasy', 'anime'],
      year: '2004',
      director: 'Hayao Miyazaki',
    },
    {
      title: 'The Wind Rises',
      director: 'Hayao Miyazaki'
    },
    {
      title: 'Princess Mononoke',
      genre: ['violence', 'suspense', 'fantasy'],
      year: '1997',
      director: 'Hayao Miyazaki'
    },
    {
      title: 'Castle in the Sky',
      genre: ['fantasy', 'romance', 'anime'],
      year: '1986',
      director: 'Hayao Miyazaki'
    },
    {
      title: 'Porco Rosso',
      genre: ['comedy', 'fantasy', 'mature'],
      year: '1992',
      director: 'Hayao Miyazaki'
    },
    {
      title: 'Spirited Away',
      genre: 'fantasy',
      year: '2001',
      director: 'Hayao Miyazaki'
    },
    {
      title: 'The Castle of Cagliostro',
      genre: ['action', 'adventure', 'anime'],
      year: '1979',
      director: 'Hayao Miyazaki'
    },
    
  ];

 //Morgan request logger
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined',{stream: accessLogStream}));

  // GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to my top Hayao Miyazaki movies');
  });
  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
  app.get('/movies', (req, res) => {
    res.json(topMiyazakiMovies);


  });
  
  app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.genre.Name === genreName).genre;
      if (genre) {
        res.status(200).json(genre);
      } else { 
        res.status(400).send("No such genre")
      }
  })
  //serving static files
app.use(express.static('public'));



//error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

  // listen for requests
  app.listen(8081, () => {
    console.log('Your app is listening on port 8081.');
  });