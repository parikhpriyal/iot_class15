var Parse= require('node-parse-api').Parse;
var APP_ID="NQTmgQVMeKnnxTfIV3FDWjpiNdIN54aMwaQl3RBJ";
var MASTER_KEY = "Fwy6uhGE9Qq5utw1B6FOm2rqZwpyayWlAR2oqNQc";
var appParse = new Parse(APP_ID, MASTER_KEY);

///INSERT OBJECT
// appParse.insert('Students', { name: 'wole',age:"20" }, function (err, response) {
//   console.log(response);
// });

// appParse.find('Students', {objectId: 'GLUxY6vHwts'}, function (err, response) {
//   console.log(response);
// });

// ///FIND ONE
// appParse.find('Students', {objectId: 'GxHV8yVy9W'}, function (err, response) {
//   console.log(response);
// });

// appParse.find('Students', {where: {age2: 100}}, function (err, response) {
//   console.log(response);
// });


//DELEATE OBJECT
appParse.delete('Jellyfish', '', function (err, response) {
console.log(response);
});