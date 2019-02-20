const Router = require('express').Router();
const rack = require('../db').Rack
const shelf = require('../db').Shelf
const product = require('../db').Product


Router.get('/all',(req,res)=>{

    rack.findAll({
        include:[{
                model:shelf,
                include:[{
                    model:product
                }]
            }]
    }).then((racksData)=>{
        if(racksData){
            res.json(racksData)
        }
        else{
            res.json({
                result:'no results found'
            })
        }
    })
    .catch(err=>{
        console.log(err);
        res.json({
            result:'error encountered!'
        })
    })
})

module.exports = Router