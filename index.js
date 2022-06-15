const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs'); // import built in node modules fs and path 
const path = require('path');
const uuid= require('uuid');

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: 'Will',
    favoriteMovies: []
},
{
    id: 2,
    name: 'Miki',
    favoriteMovies: ['Your Name']
},
]

//CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
  
})

//UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id);
  
  if (user) {
      user.name = updatedUser.name;
      res.status(200).json(user);
  } else {
      res.status(400).send(' no such user')
  

  }

})

//CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  
  let user = users.find( user => user.id == id);
  
  if (user) {
      user.favoriteMovies.push(movieTitle);
      res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
      res.status(400).send(' no such user')
  }

})

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  
  let user = users.find( user => user.id == id);
  
  if (user) {
      user.favoriteMovies = user.favoriteMovies.filter (title => title !==movieTitle);
      res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
      res.status(400).send(' no such user')
  }

})

//DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  
  let user = users.find( user => user.id == id);
  
  if (user) {
      user = users.filter (user => user.id != id);
      res.status(200).send(`${id} has been deleted`);
  } else {
      res.status(400).send(' no such user')
  }

})

let movies = [
    {
      Title: 'My Neighbor Totoro',
      Genre: {
        Name: 'anime',
        Description: 'This acclaimed animated tale by director Hayao Miyazaki follows schoolgirl Satsuke and her younger sister, Mei, as they settle into an old country house with their father and wait for their mother to recover from an illness in an area hospital. As the sisters explore their new home, they encounter and befriend playful spirits in their house and the nearby forest, most notably the massive cuddly creature known as Totoro.'},
      Year: '1988',
      Director: {
        Name: 'Hayao Miyazaki',
        DOB: '1941',
        BIO: 'Hayao Miyazaki is a Japanese animator, director, producer, screenwriter, author, and manga artist.'},
      ImagePath: "https://flxt.tmsimg.com/assets/p160146_v_h9_ab.jpg",
      Featured: false,
    },
    {
      Title: 'Avengers:Endgame',
      Genre: {
        Name: 'action',
        Description:'Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America and Bruce Banner -- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos -- the evil demigod who decimated the planet and the universe.'},
      Year: '2019',
      Director: {
        Name: 'Anthony Russo',
        DOB: '1970',
        BIO:'Anthony J. Russo is an American filmmaker and producer who works alongside his brother Joseph Russo'},
        ImagePath: "https://imageio.forbes.com/blogs-images/markhughes/files/2019/04/AVENGERS-ENDGAME-poster-DOLBY-CINEMA.jpg?format=jpg&width=960",
        Featured: false,
    },
    {
      Title: 'Your Name',
      Genre: {
        Name:'anime',
        Description:'A teenage boy living in Tokyo and a teenage girl living in the country experience a strange, random phenomenon. They occasionally switch bodies for a day at a time, and then cannot remember what happened while they were switched.'},
      Year: '2016',
      Director: {
        Name:'Makoto Shinkai',
        DOB: '1973',
        BIO:'Shinkai began his career as a video game animator with Nihon Falcom in 1996, and gained recognition as a filmmaker with the release of the original video animation She and Her Cat.'},
        ImagePath: "https://flxt.tmsimg.com/assets/p13514865_v_v10_aa.jpg",
        Featured: false,
    },
    {
      Title: 'Scream',
      Genre: { 
       Name: 'horror',
       Description:'A fright-masked knife maniac stalks high-school students in middle-class suburbia.'},
      Year: '1996',
      Director: {
        Name: 'Wes Craven',
        DOB: '1939',
        Death: '2015',
        BIO:'Wesley Earl Craven was an American film director, screenwriter, producer, actor, and editor. Due to the cultural impact and influence of his work, Craven has commonly been recognized as one of the greatest masters of the horror genre.'},
      ImagePath: "https://flxt.tmsimg.com/assets/p18852_p_v10_al.jpg",
      Featured: false,
    },
    {
      Title: 'The Ring',
      Genre: {
        Name: 'horror',
        Description:'A videotape filled with nightmarish images leads to a phone call foretelling the viewer\'s death in exactly seven days.'},
      Year: '2002',
      Director: {
        Name: 'Gore Verbinski',
        DOB: '1964',
        BIO: 'Gregor Justin \"Gore\" Verbinski is an American film director, screenwriter, producer, and musician. He is best known for directing The Ring, the Pirates of the Caribbean films, and Rango.'},
      ImagePath: "https://upload.wikimedia.org/wikipedia/en/3/37/Theringpostere.jpg",
      Featured: false,
    },
    {
      Title: 'Interstellar',
      Genre: {
        Name: 'adventure',
        Description:'A brilliant NASA physicist, is working on plans to save mankind by transporting Earth\'s population to a new home via a wormhole.But first, Brand must send former NASA pilot Cooper and a team of researchers through the wormhole and across the galaxy to find out which of three planets could be mankind\'s new home.'},
      Year: '2014',
      Director: {
        Name: 'Christopher Nolan',
        DOB:'1970',
        BIO:'Christopher Nolan CBE is a British-American film director, producer, and screenwriter. His films have grossed more than US$5 billion worldwide, and have garnered 11 Academy Awards from 36 nominations. Born and raised in London, Nolan developed an interest in filmmaking from a young age.'},
      ImagePath: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
      Featured: false,
      },
    {
      Title: 'Inception',
      Genre: {
        Name: 'action',
        Description:'Dom Cobb (Leonardo DiCaprio) is a thief with the rare ability to enter people\'s dreams and steal their secrets from their subconscious. His skill has made him a hot commodity in the world of corporate espionage but has also cost him everything he loves. Cobb gets a chance at redemption when he is offered a seemingly impossible task: Plant an idea in someone\'s mind. If he succeeds, it will be the perfect crime, but a dangerous enemy anticipates Cobb\'s every move.'},
      Year: '2010',
      Director: {
        Name: 'Christopher Nolan',
        DOB: '1970',
        BIO:'Christopher Nolan CBE is a British-American film director, producer, and screenwriter. His films have grossed more than US$5 billion worldwide, and have garnered 11 Academy Awards from 36 nominations. Born and raised in London, Nolan developed an interest in filmmaking from a young age.'},
      ImagePath: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
      Featured: false,
      },
    {
      Title: 'The Dark Knight',
      Genre: {
        Name: 'action',
        Description:'A vile young criminal calling himself the Joker (Heath Ledger) suddenly throws the town into chaos, the caped Crusader begins to tread a fine line between heroism and vigilantism.'},
      Year: '2008',
      Director: {
        Name:'Christopher Nolan',
        DOB: '1970',
        BIO: 'Christopher Nolan CBE is a British-American film director, producer, and screenwriter. His films have grossed more than US$5 billion worldwide, and have garnered 11 Academy Awards from 36 nominations. Born and raised in London, Nolan developed an interest in filmmaking from a young age.'},
      ImagePath: "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg",
      Featured: false,
      },
    {
      Title: 'Final Destination',
      Genre: {
        Name: 'horror',
        Description: 'You canno escape death'},
      Year: '2000',
      Director: {
        Name: 'Jeffrey Reddick',
        DOB: '1969',
        BIO:'Jeffrey Reddick is an American screenwriter and film director, best known for creating the Final Destination franchise.'},
      ImagePath: "https://upload.wikimedia.org/wikipedia/en/a/a3/Final_Destination_movie.jpg",
      Featured: false,
      },
    {
      Title: 'Pineapple Express',
      Genre: {
        Name: 'comedy',
        Description:'Stoner Dale Denton\'s (Seth Rogen) enjoyment of a rare strain of marijuana may prove fatal when he drops his roach in a panic after witnessing a murder. Upon learning that the fancy weed can be traced back to them, Dale and his dealer (James Franco) go on the lam, with a dangerous drug lord (Gary Cole) and crooked cop (Rosie Perez) hot on their heels.'},
      Year: '2008',
      Director: {
        Name: 'David Green',
        DOB: '1975',
        BIO: 'Green is an American filmmaker.In 2008, Green transitioned into comedy, directing the films Pineapple Express, Your Highness and The Sitter.'},
      ImagePath: "https://upload.wikimedia.org/wikipedia/en/c/ca/Pineapple_Express_Poster.jpg",
      Featured: false,
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
    app.get('/movies/directors/:directorName', (req, res) => {
      const { directorName } = req.params;
      const director = movies.find( movie => movie.Director.Name === directorName).Director;
      if (director) {
        res.status(200).json(director);
      } else {
        res.status(400).send("Director does not exist")
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
  app.listen(8083, () => {
    console.log('Your app is listening on port 8083.');
  });