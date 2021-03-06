const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs'); // import built in node modules fs and path 
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');

const Models = require('./models.js');


const app = express();
const Movies = Models.Movie;
const Users = Models.User;


app.use(bodyParser.json());
app.use(cors());

//mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./auth')(app);
require('./passport');

  // GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to Showflix');
  });
  

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', 
[
  check('Username', 'Username is required').isLength({min:5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
],
  (req, res) => {

    //check the validation object for errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()});
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

  // Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
     .catch((err) => {
       console.error(err);
       res.status(500).send('Error: ' + err);
    });
 });

    //Get JSON movies
app.get("/movies", passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});

    // Get JSON movie title
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne( {Title: req.params.Title})
    .then ((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});

    //Get JSON genre info
app.get('/movies/genre/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
    .then((movie) => {
      res.json(movie.Genre);
    })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error: ' + err);
    });
});

    //Get JSON director info
//READ Directors-get- Get a movie director
app.get('/movies/director/:Name',  passport.authenticate('jwt', { session: false }),(req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
    .then((movie) => {
      res.json(movie.Director);
      })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

  // Get a user by username
app.get('/users/:Username',  passport.authenticate('jwt', { session: false }),(req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', [
check('Username', 'Username is required').isLength({min: 5}),
check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail()
], passport.authenticate('jwt', { session: false }),
(req, res) => {
// check the validation object for errors
let errors = validationResult(req);

if (!errors.isEmpty()) {
  return res.status(422).json({ errors: errors.array() });
}
let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
    },
    { new: true }, // This line makes sure that the updated document is returned
    
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

  

  // Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID',  passport.authenticate('jwt', { session: false }),(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

  // Delete a user by username
app.delete('/users/:Username',  passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

  //DELETE- delete- Delete a movie from user's favorite movies
app.delete('/users/:Username/movies/:MovieID',  passport.authenticate('jwt', { session: false }),(req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

   //Morgan request logger
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined',{stream: accessLogStream}));

//access documentation.html using express .static
app.use("documentation", express.static("Module"));


//error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

  // listen for requests
  const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0',() => {
   console.log('Listening on Port ' + port);
});