const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('error getting unique ID');
    } else {
      items[id] = text;
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        callback(err, { id, text });
      });
    }
  });
};

/*
Next, refactor the readAll function by returning an array of todos to client app whenever a GET request to the collection route occurs. To do this, you will need to read the dataDir directory and build a list of files. Remember, the id of each todo item is encoded in its filename.

VERY IMPORTANT: at this point in the basic requirements, do not attempt to read the contents of each file that contains the todo item text. Failing to heed this instruction has the potential to send you down a rabbit hole.

Please note, however, you must still include a text field in your response to the client, and it's recommended that you use the message's id (that you identified from the filename) for both the id field and the text field. Doing so will have the effect of changing the presentation of your todo items for the time being; we'll address this issue shortly.
*/
exports.readAll = (callback) => {
  var listOfFiles = [];

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('error reading all files');
    } else {
      _.map(files, (file) => {
        let split = file.split('.');
        listOfFiles.push({ id: `${split[0]}`, text: `${split[0]}`});
      });
      callback(err, listOfFiles);
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////
exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
