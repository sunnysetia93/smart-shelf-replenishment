const Router = require('express').Router();
const rack = require('../db').Rack

Router.get('/',(req,res)=>{

    rack.findAll().then((racks)=>{
        res.send(racks);
    })
})

module.exports = Router