import express from 'express';
import morgan from 'morgan';
import { MongoClient, ObjectId } from 'mongodb';

process.loadEnvFile('./.env');

const host = process.env.HOST;
const port = process.env.PORT;
const mongo_db = process.env.MONGO_DB;
const dabase_name = process.env.DABASE_NAME;
const collection = process.env.COLLECTION;

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.send('Hello !');
});
app.get('/home', function(req, res) {
  res.send('Maison :-)');
});
app.get('/user/:uid', function(req, res) {
  res.render('user', {uid: req.params.uid});
});

async function printAllContacts(collection) {
    const results = await collection.find().toArray();
    for (const result of results) {
        console.log(`Contact : ${result.name} is ${result.age}`);
    }
}

async function main() {
    let client;
    try {
        console.log('Trying to connect...')
        const client = new MongoClient(mongo_db);        
        const db = client.db(dabase_name);
        console.log("Successfully connected to MongoDB.");
        const contacts = db.collection(collection);
        await client.connect();

        app.get('/api/contacts', async (req, res) => {
            try {
                const results = await contacts.find().toArray();
                res.json(results); // Renvoie un tableau JSON
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
        });

        app.get('/api/contacts/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const contact = await contacts.findOne({ _id: new ObjectId(id) });
                if (!contact) {
                    return res.status(404).json({ error: 'Contact introuvable' });
                }
                res.json(contact);
            } catch (e) {
                res.status(400).json({ error: 'Format d\'ID invalide' });
            }
        });

        app.post('/api/contacts', async (req, res) => {
            try {
                const newContact = req.body; // Récupère les données envoyées en JSON
                const result = await contacts.insertOne(newContact);
                
                // Récupérer le contact tout juste créé pour le renvoyer
                const createdContact = await contacts.findOne({ _id: result.insertedId });
                res.status(201).json(createdContact);
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
        });

        app.put('/api/contacts/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const updatedData = req.body;

                await contacts.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );

                const updatedContact = await contacts.findOne({ _id: new ObjectId(id) });
                if (!updatedContact) {
                    return res.status(404).json({ error: 'Contact introuvable' });
                }
                res.json(updatedContact);
            } catch (e) {
                res.status(400).json({ error: e.message });
            }
        });

        app.delete('/api/contacts/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const result = await contacts.deleteOne({ _id: new ObjectId(id) });
                
                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: 'Contact introuvable' });
                }
                res.json({ message: 'Contact supprimé avec succès', id });
            } catch (e) {
                res.status(400).json({ error: 'Format d\'ID invalide' });
            }
        });

        await printAllContacts(contacts);

        app.use(function(req, res){
            res.status(404).send('Page introuvable !');
        });

        app.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`)
        });
    } catch (e) {
        console.error(e)
    }
}

main();