const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const hbs = require('hbs');

// mongo
const {ObjectID} = require('mongodb');
var {mongoose} = require('./server/mongoose');
var {List} = require('./server/models/list');

// config
var app = express();
app.listen(port, () => console.log(`Server is up on ${port}`));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));
app.set('view engine', 'hbs');

let listArr = [];

// routes
app.get('/home', (req, res) => {
  List.distinct('title').then((lists) => {
  	listArr = [];
    listArr.push(lists);     
  	res.render('index.hbs', { listArr: lists });
  });  
});

// post
app.post('/', (req, res) => {

	if (req.body.createList){
		listArr.push(req.body.createList);

	  var list = new List({
	    title: req.body.createList
	  });
	  list.save().then((doc) => {
	  }, (e) => {
	    res.status(400).send(e);
	  });

		res.redirect('back');

	} else if (req.body.aListItem) {


	  List.find({'title': req.body.aListItem}).then((lists) => {
	  	console.log(lists[0].items);

// create var and pass to js to use in getMovies()
// replace star with minus



   	}, (e) => {
      res.status(400).send(e);
    });  

	} else {
    List.update(
    	{ 'title': listArr[0]}, 
    	{ $push: { 'items': [req.body.movie] } }
    ).then((lists) => {
      List.find({title: 'items'}).then((lists) => {
      }, (e) => {
        res.status(400).send(e);
      });
    });
	}

});