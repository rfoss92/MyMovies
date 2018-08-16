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
let moviesArr = [];
let activeList = '';

// routes
app.get('/', (req, res) => {
  List.distinct('title').then((lists) => {
  	listArr = [lists];  
  	res.render('index.hbs', { 
  		listArr: lists,
  		moviesArr,
 			activeList 		
  	});	
  });  
});
app.get('/movie', (req, res) => {
  List.distinct('title').then((lists) => {
  	listArr = [lists];
  	res.render('movie.hbs', { 
  		listArr: lists,
 			activeList 		
  	});	
  });  
});

// post
app.post('/', (req, res) => {

	// create list
	if (req.body.createList) {
		listArr.push(req.body.createList); 
	  let list = new List({
	    title: req.body.createList
	  }).save();
		res.redirect('/');

	// retrieve list
	} else if (req.body.listSelect) {
	  List.find({'title': req.body.listSelect}).then((lists) => {
			activeList = req.body.listSelect;
			moviesArr = [lists[0].items];
   	});
		res.redirect('/');

	// remove list
	} else if (req.body.listRemove) {
	  List.remove({'title': req.body.listRemove}).then((lists) => {
	  	moviesArr = [];
   	});
		res.redirect('/');

	// add to list
	} else if (req.body.movie) {
		let test = req.body.movie.split(',');
		if (test[1]){
	    List.updateOne(
	    	{ 'title': test[1]},
	    	{ $addToSet: { 'items': [test[0]] } },
	    	{ upsert: true }
	    ).then();
		} 
		res.redirect('back');		

  // remove from list
	} else if (req.body) {
		for (var key in req.body) {}
	  List.update(
		  { 'title': activeList },
		  { $pull: {'items' : req.body[key] } },
		).then();	
	}

});