import Router from 'express';

const user_router = Router();

user_router.get('/hello', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

user_router.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

export default user_router;