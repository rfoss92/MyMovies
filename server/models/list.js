var mongoose = require('mongoose');


var List = mongoose.model('List', {
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  items: {
    type: Array,
    default: null
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {List};
