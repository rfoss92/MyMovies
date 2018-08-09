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
let moviesArr = [];
let activeList = '';

// routes
app.get('/', (req, res) => {
  List.distinct('title').then((lists) => {
  	listArr = [];	
    listArr.push(lists);     
  	res.render('index.hbs', { 
  		listArr: lists,
  		moviesArr: moviesArr[0],
 			activeList: activeList 		
  	});	
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
			activeList = req.body.aListItem;   	
			moviesArr = [];  		  	
		  moviesArr.push(lists[0].items); 

   	}, (e) => {
      res.status(400).send(e);
    });  
		res.redirect('back');

	} else if (req.body) {
	  List.find({'title': Object.keys(req.body)[0]}).then((lists) => {
	  	let test = Object.keys(req.body)[0];
	  	test = req.body.test;
			List.update(
			  { },
			  { $pull: { items: { test } } },
			  { multi: true }
			)
			console.log(req.body.test);

   	}, (e) => {
      res.status(400).send(e);
    });  
		res.redirect('back');

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