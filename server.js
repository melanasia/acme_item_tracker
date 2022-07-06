const { conn, User, Thing } = require('./db');
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json()); // Body parsing middleware
app.use('/dist', express.static('dist')); // // Static middleware

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));


app.post('/api/things', async(req, res, next)=> {
  try {
    res.status(201).send(await Thing.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/things', async(req, res, next)=> {
  try {
    res.status(201).send(await User.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

// get route to show the thing(s) with highest ranking

app.get('/api/things', async(req, res, next)=> {
  try {
    res.send(await Thing.findAll({
      order: [
        ['ranking', 'DESC'],
      ]
    }));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await User.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users', async(req, res, next)=> {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
        res.sendStatus(400)
        return;
    }
    res.send(await User.findByPk(id));
  }
  catch(ex){
    next(ex);
  }
});

// create a thing on the server that accepts and id and a vote

app.post('/api/things/vote', async(req, res, next)=> {
  try {
    const id = req.body.id;
    const isUpvote = req.body.increase_rank === true;
    if (isNaN(id)) {
        res.sendStatus(400)
        return;
    }
    const thing = await Thing.findByPk(id);
    thing.ranking = isUpvote ? thing.ranking + 1 : thing.ranking - 1;
    await thing.save();
    res.status(201).send(thing);
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/users/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        if (isNaN(id)){
            res.sendStatus(400)
            return;
        }
        const user = await User.findByPk(req.params.id)
        if (user == null){
            res.sendStatus(404)
            return;
        } 
        await user.destroy()
    res.sendStatus(204);
    }
    catch(ex){
        next(ex);
    }
})

app.delete('/api/things/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        if (isNaN(id)){
            res.sendStatus(400)
            return;
        }
        const thing = await Thing.findByPk(req.params.id)
        if (thing == null){
            res.sendStatus(404)
            return;
        } 
        await thing.destroy()
    res.sendStatus(204);
    }
    catch(ex){
        next(ex);
    }
})


const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`));

// link a thing to a user in the seed function
const init = async()=> {
  try {
    await conn.sync({ force: true });
    const [moe, larry, lucy, ethyl] = await Promise.all(
      ['moe', 'larry', 'lucy', 'ethyl'].map( name => User.create({ name }))
    );
    const [foo, bar, bazz, quq, fizz] = await Promise.all(
      ['foo', 'bar', 'bazz', 'quq', 'fizz'].map( name => Thing.create({ name }))
    );
    
    // thing needs a userId
    const owner = await User.create({name: 'Melanie'});
    await Thing.create({name: 'chair', userId: owner.id, ranking: 9})
    
  }
  catch(ex){
    console.log(ex);
  }
};

init();


