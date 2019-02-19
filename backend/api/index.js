const Router = require('express').Router();

Router.use('/product',require('./product'));
Router.use('/shelf',require('./shelf'));
Router.use('/rack',require('./rack'));


module.exports = Router;