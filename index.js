const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs'); // import built in node modules fs and path 
const path = require('path');
const uuid= require('uuid');

app.use(bodyParser.json());

let movies = [
    {
      Title: 'My Neighbor Totoro',
      Genre: ['anime', 'fantasy', 'family'],
      Year: '1988',
      Director: 'Hayao Miyazaki',
    },
    {
      Title: 'Kiki\'s Delivery Service',
      Genre: ['anime', 'fantasy', 'adventure'],
      Year: '1989',
      Director: 'Hayao Miyazaki'
    },
    {
      Title: 'Ponyo',
      Genre: ['anime', 'violence'],
      Year: '2008',
      Director: 'Hayao Miyazaki',
    },
    {
      Title: 'Howl\'s Moving Castle',
      Genre: ['fantasy', 'anime'],
      Year: '2004',
      Director: 'Hayao Miyazaki',
    },
    {
      Title: 'The Wind Rises',
      Genre: ['war', 'romance'],
      Director: 'Hayao Miyazaki'
    },
    {
      Title: 'Princess Mononoke',
      Genre: ['violence', 'suspense', 'fantasy'],
      Year: '1997',
      Director: 'Hayao Miyazaki'
    },
    {
      Title: 'Castle in the Sky',
      Genre: ['fantasy', 'romance', 'anime'],
      Year: '1986',
      Director: 'Hayao Miyazaki'
    },
    {
      Title: 'Porco Rosso',
      Genre: ['comedy', 'fantasy', 'mature'],
      Year: '1992',
      Director: 'Hayao Miyazaki'
    },
    {
      Title: 'Spirited Away',
      Genre: 'fantasy',
      Year: '2001',
      Director: 'Hayao Miyazaki'
    },
    {
      Title: 'The Castle of Cagliostro',
      Genre: ['action', 'adventure', 'anime'],
      Year: '1979',
      Director: 'Hayao Miyazaki'
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
    res.json(movies);


  });

  //READ
  app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movie.find( movies => movies.Title === title);
    if (title) {
      res.status(200).json(title);
    } else {
      res.status(400).send("No such title")
    }
  });
    app.get('/movies/title', (req, res) => {
      res.json(title);
  });
  
  //READ
  app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const movie = movie.find( movies => movies.Genre.name === genreName).genre;
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
  app.listen(8082, () => {
    console.log('Your app is listening on port 8082.');
  });