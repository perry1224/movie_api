const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'), // import built in node modules fs and path 
  path = require('path');


let topMiyazakiMovies = [
    {
      title: 'My Neighbor Totoro',
      creator: 'Hayao Miyazaki'
    },
    {
      title: 'Kiki\'s Delivery Service',
      creator: 'Hayao Miyazaki'
    },
    {
      title: 'Ponyo',
      creator: 'Hayao Miyazaki'
    },
    {
      title: 'Howl\'s Moving Castle',
      creator: 'Hayao Miyazaki'
    },
    {
      title: 'The Wind Rises',
      creator: 'Hayao Miyazaki'
    },
    {
      title: 'Princess Mononoke',
      creator: 'Hayao Miyazaki'
    },
    {
      title: 'Castle in the Sky',
      creator: 'Hayao Miyazaki'
    },
    {
      title: 'Porco Rosso',
      creator: 'Hayao Miyazaki'
    },
    {
      title: 'Spirited Away',
      creator: 'Hayao Miyazaki'
    },
    {
      title: 'The Castle of Cagliostro',
      creator: 'Hayao Miyazaki'
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
  
//serving static files
app.use(express.static('public'));



    //error handling
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });

  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });