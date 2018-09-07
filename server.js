const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const hbs = require('hbs');
let {mongoose} = require('./server/mongoose');
let {List} = require('./server/models/list');

// config
let app = express();
app.listen(port, () => console.log(`Server is up on ${port}`));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));
app.set('view engine', 'hbs');

// variables
let listArr = [];
let moviesInList = [];
let activeList = '';
let output = '';

// routes
app.get('/', (req, res) => {
  List.distinct('title').then((lists) => {
  	listArr = [lists];  
  	res.render('index.hbs', { 
  		listArr: lists,
  		moviesInList,
 			activeList 		
  	});	
  });  
});

// posts
app.post('/', (req, res) => {
	(req.body.createList) ? (createList(req, res))
	: (req.body.retrieveList) ? (retrieveList(req, res))
	: (req.body.removeList) ? (removeList(req, res))
	: (req.body.movie) ? (addToList(req, res))
	: (removeFromList(req, res));
});

// functions
function createList(req, res){
	listArr.push(req.body.createList); 
  let list = new List({
    title: req.body.createList
  }).save();
	res.redirect('/');
}
function retrieveList(req, res){
  List.find({'title': req.body.retrieveList}).then((lists) => {
		activeList = req.body.retrieveList;
		moviesInList = [lists[0].items];
		output = '';
 	});
	res.redirect('/');
}
function removeList(req, res){
  List.remove({'title': req.body.removeList}).then((lists) => {
  	moviesInList = [];
 	});
	res.redirect('/');	
}
function addToList(req, res){
	let splitMovies = req.body.movie.split(',');
	if (splitMovies[1]){
    List.updateOne(
    	{ 'title': splitMovies[1]},
    	{ $addToSet: { 'items': [splitMovies[0]] } },
    	{ upsert: true }
    ).then();
	} 
}
function removeFromList(req, res){
	for (var key in req.body) {}
  List.update(
	  { 'title': activeList },
	  { $pull: {'items' : req.body[key] } },
	).then();		
}