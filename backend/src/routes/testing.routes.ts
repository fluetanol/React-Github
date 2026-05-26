import Router from "express";
import { authToken } from "../middlewares/auth.middleware";


const testing_router = Router();

// api/testing/health
testing_router.get('/health', (req, res)=>{
    res.send('Server is healthy');
});

// api/testing/authhealth
testing_router.get('/authhealth', authToken, (req, res)=>{
    res.send('Authenticated request is healthy');
});


testing_router.get('/authjson', authToken, (req, res)=>{
    res.json({ 
        message: 'This is a JSON response from an authenticated endpoint',
        name : 'Dench',
        timestamp : new Date().toISOString(),
        description : 'This endpoint is used to test authenticated JSON responses in the Dench testing suite'
        
    });
})

testing_router.get('/authformdata', authToken, (req, res)=>{
    const formData = new FormData();
    formData.append('message', 'This is a FormData response from an authenticated endpoint');
    res.send(formData);
})



// api/testing/health (POST)
testing_router.post('/health', (req, res)=>{
    console.log("Received POST request to /api/testing/health with body:", req.body);
    const { message } = req.body;
    res.json({ message : `Received message: ${message}` });
});


// api/testing/authhealth (POST)
testing_router.post('/authhealth', authToken, (req, res) => {
    console.log("Received POST request to /api/testing/authhealth with body:", req.body);
    const { message } = req.body;
    res.json({ message: `Received message: ${message}` });
});





// api/testing/health (PUT)
testing_router.put('/health', (req, res)=>{
    const { message } = req.body;
    res.json({ message : `Received PUT message: ${message}` });
});



// api/testing/health (DELETE)
testing_router.delete('/health', (req, res)=>{
    res.json({ message : 'Received DELETE request' });
});

export default testing_router;