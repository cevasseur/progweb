import { Router } from 'express';
import { getAllContacts, getContactById, updateContact, removeContact, addContact } from '../controllers/contactController.js';

const router = Router();

router.get('/', function (req, res) {
    res.status(200).json({
        status: 'API is Working',
        message: 'Welcome!',
    });
});

router.route('/contacts').get(async (req, res) => {
    let response = await getAllContacts();
    if (response.success == true) {
        res.status(200).json(response);
    } else {
        res.status(404).json(response);
    }
});

router.route('/contacts/:id').get(async (req, res) => {
    const id = req.params.id;
    let response = await getContactById(id);
    res.status(response.success == true ? 200:404).json(response);
});

router.route('/contacts').post(async (req, res) => {
    const body = req.body;
    let response = await addContact(body);
    res.status(response.success == true ? 201:500).json(response);
});

router.route('/contacts/:id').put(async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    let response = await updateContact(id, body.name, body.age);
    res.status(response.success == true ? 200:400).json(response);
});

router.route('/contacts/:id').delete(async (req, res) => {
    const id = req.params.id;
    let response = await removeContact(id);
    res.status(response.success == true ? 200:404).json(response);
});

export default router;
    