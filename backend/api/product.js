const Router = require('express').Router();
const product = require('../db').Product
const shelf = require('../db').Shelf

Router.get('/',(req,res)=>{

    product.findAll({
        include:[{
            model:shelf
        }]
    }).then((products)=>{
        res.send(products);
    })
})

Router.get('/:id',(req,res)=>{

    console.log(req.params.id)

    product.findById(req.params.id).then((product)=>{
        if(!product)
            res.send({
                result:'no result found'
            })
        else
            res.send(product);
    })
    .catch(err=>{
        console.log(err);
        res.err(err);
    })
})

Router.post('/findShelf',(req,res)=>{
    product.find({
        where:{
            name:req.body.name
        },
        include:[{model:shelf}]
    })
    .then((shelfDetails)=>{
        if(shelfDetails)
            res.send(shelfDetails.shelf);
        else
            res.send({
                result:'no result found'
            })
    })
})

module.exports = Router