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
      Genre: {
        Name: 'anime',
        Description: 'This acclaimed animated tale by director Hayao Miyazaki follows schoolgirl Satsuke and her younger sister, Mei, as they settle into an old country house with their father and wait for their mother to recover from an illness in an area hospital. As the sisters explore their new home, they encounter and befriend playful spirits in their house and the nearby forest, most notably the massive cuddly creature known as Totoro.'},
      Year: '1988',
      Director: 'Hayao Miyazaki',
    },
    {
      Title: 'Avengers:Endgame',
      Genre: {
        Name: 'action',
        Description:'Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America and Bruce Banner -- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos -- the evil demigod who decimated the planet and the universe.'},
      Year: '2019',
      Director: 'Anthony Russo',
    },
    {
      Title: 'Your Name',
      Genre: {
        Name:'anime',
        Description:'A teenage boy living in Tokyo and a teenage girl living in the country experience a strange, random phenomenon. They occasionally switch bodies for a day at a time, and then cannot remember what happened while they were switched.'},
      Year: '2016',
      Director: 'Makoto Shinkai',
    },
    {
      Title: 'Scream',
      Genre: { 
       Name: 'horror',
       Description:'A fright-masked knife maniac stalks high-school students in middle-class suburbia.'},
      Year: '1996',
      Director: 'Wes Craven',
    },
    {
      Title: 'The Ring',
      Genre: {
        Name: 'horror',
        Description:'A videotape filled with nightmarish images leads to a phone call foretelling the viewer\'s death in exactly seven days.'},
      Year: '2002',
      Director: 'Gore Verbinski',
    },
    {
      Title: 'Interstellar',
      Genre: {
        Name: 'adventure',
        Description:'A brilliant NASA physicist, is working on plans to save mankind by transporting Earth\'s population to a new home via a wormhole.But first, Brand must send former NASA pilot Cooper and a team of researchers through the wormhole and across the galaxy to find out which of three planets could be mankind\'s new home.'},
      Year: '2014',
      Director: 'Christopher Nolan',
    },
    {
      Title: 'Inception',
      Genre: {
        Name: 'action',
        Description:'Dom Cobb (Leonardo DiCaprio) is a thief with the rare ability to enter people\'s dreams and steal their secrets from their subconscious. His skill has made him a hot commodity in the world of corporate espionage but has also cost him everything he loves. Cobb gets a chance at redemption when he is offered a seemingly impossible task: Plant an idea in someone\'s mind. If he succeeds, it will be the perfect crime, but a dangerous enemy anticipates Cobb\'s every move.'},
      Year: '2010',
      Director: 'Christopher Nolan',
    },
    {
      Title: 'The Dark Knight',
      Genre: {
        Name: 'action',
        Description:'A vile young criminal calling himself the Joker (Heath Ledger) suddenly throws the town into chaos, the caped Crusader begins to tread a fine line between heroism and vigilantism.'},
      Year: '2008',
      Director: 'Christopher Nolan',
    },
    {
      Title: 'Final Destination',
      Genre: {
        Name: 'horror',
        Description: 'You canno escape death'},
      Year: '2000',
      Director: 'Jeffrey Reddick',
    },
    {
      Title: 'Pineapple Express',
      Genre: {
        Name: 'comedy',
        Description:'Stoner Dale Denton\'s (Seth Rogen) enjoyment of a rare strain of marijuana may prove fatal when he drops his roach in a panic after witnessing a murder. Upon learning that the fancy weed can be traced back to them, Dale and his dealer (James Franco) go on the lam, with a dangerous drug lord (Gary Cole) and crooked cop (Rosie Perez) hot on their heels.'},
      Year: '2008',
      Director: 'David Green',
    },
    
  ];

  // GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to my top movies');
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
    const movie = movies.find( movie => movie.Title === title);
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send("No such title")
    }
  });

  
  //READ
  app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;
      if (genre) {
        res.status(200).json(genre);
      } else { 
        res.status(400).send("No such genre")
      }
  })
  
  //serving static files
app.use(express.static('public'));


 //Morgan request logger
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined',{stream: accessLogStream}));




//error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

  // listen for requests
  app.listen(8082, () => {
    console.log('Your app is listening on port 8082.');
  });