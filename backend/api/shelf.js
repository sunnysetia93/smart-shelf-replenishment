const Router = require('express').Router();
const shelf = require('../db').Shelf
const product = require('../db').Product

Router.get('/',(req,res)=>{

    shelf.findAll().then((shelves)=>{
        res.send(shelves);
    })
})

Router.post('/allocateProduct',(req,res)=>{

    if(!req.body.productName && !req.body.shelfId){
        return res.json({
            status:'404',
            result:'Missing productName and shelfId in request!'
        })
    }
    console.log(req.body.productName,req.body.shelfId)
    product.find({
        where:{
            name:req.body.productName
        }
    })
    .then(foundProduct=>{
        if(!foundProduct){
            return res.json({
                status:'404',
                result:'no product found'
            })
        }

        shelf.update(
            {
                productId:foundProduct.id
            },
            {
                where:{
                    id:req.body.shelfId
                }
            }
        )
        .then(updatedShelf=>{
            if(updatedShelf && updatedShelf[0]==1)
            res.send({
                status:updatedShelf[0],
            })
            
        else
            res.send({
                status:updatedShelf[0],
                result:'Error in Updation'
            })
        })

    })
    .catch(err=>{
        res.send({
            result:'Error encountered',
            err:err
        })
    })
})

Router.put('/update',(req,res)=>{
    shelf.findById(req.body.id)
    .then((shelfResult)=>{
        if(shelfResult){
            shelf.update(
            {
                availability:req.body.availability
            },
            {
                where:{
                    id:shelfResult.id
                }
            })
            .then((updatedShelf)=>{
                if(updatedShelf && updatedShelf[0]==1)
                    res.send({
                        status:updatedShelf[0],
                    })
                    
                else
                    res.send({
                        status:updatedShelf[0],
                        result:'Error in Updation'
                    })
            })
        }
        else
        res.send({
            result:'Shelf Not found. Cannot Update'
        })
    })
    .catch(err=>{
        res.send({
            result:'Error encountered',
            err:err
        })
    })
})
module.exports = Router