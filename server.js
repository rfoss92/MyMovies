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
  	activeList = listArr[0][0];	   
  	res.render('index.hbs', { 
  		listArr: lists,
  		moviesArr,
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
		res.redirect('back');

	// retrieve list
	} else if (req.body.aListItem) {
	  List.find({'title': req.body.aListItem}).then((lists) => {
			activeList = req.body.aListItem;
			moviesArr = [lists[0].items];
   	});
		res.redirect('back');

	// add to list
	} else if (req.body.movie) {
    List.updateOne(
    	{ 'title': activeList},
    	{ $addToSet: { 'items': [req.body.movie] } },
    	{ upsert: true }
    ).then();
    console.log(req.body);

  // remove from list
	} else if (req.body) {
		for (var key in req.body) {}
	  List.update(
		  { 'title': activeList },
		  { $pull: {'items' : req.body[key] } },
		).then();
	}

});

// create active class
// be able to select which list to add to