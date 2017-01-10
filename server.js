const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// When running locally, the env variables PORT set by heroku
// wont exist, so we supply 3000 instead
const port = process.env.PORT || 3000;

var app = express();

// All partials should be inside __dirname/views/partials
hbs.registerPartials(__dirname + '/views/partials');

// Set default template suffix to .hbs
app.set('view engine', 'hbs');


// middleware which logs all request to server
app.use( (req, res, next) => {
    var now = new Date().toString();
    var logString = `${now}: ${req.method} ${req.url}`;

    console.log(logString);
    // Append all log into a file server.log
    fs.appendFile('server.log', logString + '\n', (err) => {
        if(err){
            console.log("Unable to append to server.log");
        }
    });

    // Call next() so express app can move on to next function
    next();
});


// middleware which renders maintenance page and stop the app
// next() is not called so server wont run further
// app.use( (req, res, next) => {
//     res.render('maintenance', {
//         pageTitle: 'Maintenance',
//         welcomeMessage: 'Welcome to home page!'
//     });
// });


app.use(express.static(__dirname + '/public'));




// Handlebar helper function which returns current year
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

// Helper function that takes a variable called text
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {

    res.render('home', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to home page!'
    });

});

app.get('/about', (req, res) => {
    res.render('about', {
        pageTitle: 'About Page',

    });
});

app.get('/project', (req, res) => {
    res.render('project', {
        pageTitle: 'Project Page'
    });
});


app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});


app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
