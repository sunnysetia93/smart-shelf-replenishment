const Sequelize = require('sequelize');
const DB_Info   = require('./config').DB_Info;

const db = new Sequelize('shelf_replenishment',DB_Info.username,DB_Info.password,
{
    host:'localhost',
    dialect:'mysql',
    pool: {
        max: 5,
        min: 0
    },
    insecureAuth : true
})

const Product = db.define('products',{
    id :{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:true
    },
    quantity:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})

const Rack = db.define('racks',{
    id :{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    location:{
        type:Sequelize.STRING,
        allowNull:true
    },
    shelves_available:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})

const Shelf = db.define('shelves',{
    id :{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    number:{
        type:Sequelize.STRING,
        allowNull:true
    },
    availability:{
        type:Sequelize.INTEGER,
        allowNull:true,
        defaultValue:100
    }
});

Rack.hasMany(Shelf);
Shelf.belongsTo(Rack);

Product.hasOne(Shelf);
Shelf.belongsTo(Product);

async function dbRefresh()
{
    try
    {
        await db.authenticate();
        await db.sync();
        await Rack.findOrCreate({where:{id:1},defaults:{location:'ground floor A wing',shelves_available:4}});
        await Product.findOrCreate({where:{id:1},defaults:{name:'Real Juice',quantity:50}});
        await Product.findOrCreate({where:{id:2},defaults:{name:'Cold Drink Can',quantity:50}});
        await Product.findOrCreate({where:{id:3},defaults:{name:'Cornflakes',quantity:50}});
        await Product.findOrCreate({where:{id:4},defaults:{name:'Ketchup',quantity:50}});

        await Shelf.findOrCreate({where:{id:1},defaults:{number:1,productId:1,rackId:1,type:''}});
        await Shelf.findOrCreate({where:{id:2},defaults:{number:1,productId:2,rackId:1,type:''}});
        await Shelf.findOrCreate({where:{id:3},defaults:{number:1,productId:3,rackId:1,type:''}});
        await Shelf.findOrCreate({where:{id:4},defaults:{number:1,productId:4,rackId:1,type:''}});

    }
    catch(err)
    {
        console.log(err);
    }
}

dbRefresh();

module.exports = {
    Product,Rack,Shelf
}