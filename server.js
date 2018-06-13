const express = require('express');
const exphb = require('express-handlebars');
const MongoClient = require('mongodb').MongoClient;

const mongoHost = "classmongo.engr.oregonstate.edu";
const mongoPort = 27017;
const mongoUser = "cs290_shieldse";
const mongoPassword = "cs290_shieldse";
const mongoDBName = "cs290_shieldse";

const mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' +
    mongoHost + ':' + mongoPort + '/' + mongoDBName;

const app = express();
const port = process.env.PORT || 3000;

app.engine('handlebars', exphb({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

let mongoDB = null;
app.get('/', (req, res) => {
    const routes = mongoDB.collection('routes').find({});
    const coords = mongoDB.collection('coords').find({});

    routes.toArray((err, routeDocs) => {
        if (err) {
            res.status(500).send("Error fetching routes from DB.");
        } else {
            console.log(routeDocs);
            coords.toArray((err, coordsDocs) => {
                if (err) {
                    res.status(500).send("Error fetching coords from DB.");
                } else {
                    console.log(coordsDocs);
                    res.status(200).render('airport', {
                        routes: routeDocs
                    });
                }
            });
        }
    });
});

app.get('*', (req, res) => {
    res.status(404).render('404');
});

MongoClient.connect(mongoURL, (err, client) => {
    if (err) {
        throw err;
    }
    mongoDB = client.db(mongoDBName);
    app.listen(port, () => {
        console.log("== Server listening on port 3000");
    });
});
