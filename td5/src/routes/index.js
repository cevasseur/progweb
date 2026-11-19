import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { getAllContacts, getContactById, updateContact, removeContact, addContact } from '../controllers/contactController.js';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = Router();

// router.use('/contacts', requireAuth); // Permet de retirer requireAuth dans toutes les routes qui ont '/contacts'

router.route('/auth/register').post(async (req, res) => {
    const response = await registerUser(req.body);
    res.status(response.success ? 201:400).json(response);
});

router.route('/auth/login').post(async (req, res) => {
    const response = await loginUser(req.body);
    res.status(response.success ? 200:401).json(response);
});

router.get('/', function (req, res) {
    res.status(200).json({
        status: 'API is Working',
        message: 'Welcome!',
    });
});

router.route('/contacts').get(requireAuth, async (req, res) => {
    let response = await getAllContacts();
    res.status(response.success ? 200:404).json(response);
}).post(requireAuth, async (req, res) => {
    let response = await addContact(req.body);
    res.status(response.success ? 201:500).json(response);
});

router.route('/contacts/:id').get(requireAuth, async (req, res) => {
    let response = await getContactById(req.params.id);
    res.status(response.success == true ? 200:404).json(response);
}).put(requireAuth, async (req, res) => {
    const id = req.params.id;
    const { name, age } = req.body;
    let response = await updateContact(id, name, age);
    res.status(response.success ? 200:400).json(response);
}).delete(requireAuth, async (req, res) => {
    let response = await removeContact(req.params.id);
    res.status(response.success ? 200:404).json(response);
});

export default router;
    