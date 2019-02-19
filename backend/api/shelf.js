const Router = require('express').Router();
const shelf = require('../db').Shelf

Router.get('/',(req,res)=>{

    shelf.findAll().then((shelves)=>{
        res.send(shelves);
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