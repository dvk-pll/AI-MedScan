import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import { config } from 'dotenv';
import { logger } from './utils/logger';
import cors from 'cors';

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    logger.info('Database connected successfully');
})
.catch((error) => {
    logger.error('Database connection failed:', error);
});
function analyzeSymptoms(symptoms: string[]) {
    const lowercasedSymptoms = symptoms.map(s => s.toLowerCase().trim());
    const conditions: { name: string; probability: number }[] = [];
    let advice: string | null = null;

    if (lowercasedSymptoms.includes('fever') && lowercasedSymptoms.includes('cough')) {
        conditions.push({ name: 'Common Cold or Flu', probability: 0.7 });
        advice = 'Rest, drink plenty of fluids, and consider over-the-counter medication.';
    } else if (lowercasedSymptoms.includes('headache') && lowercasedSymptoms.includes('fatigue')) {
        conditions.push({ name: 'Possible Dehydration or Stress', probability: 0.6 });
        advice = 'Try drinking water and getting some rest.';
    } else if (lowercasedSymptoms.includes('chest pain')) {
        conditions.push({ name: 'Seek Immediate Medical Attention', probability: 0.9 });
        advice = 'Chest pain can be serious. Please consult a doctor immediately.';
    } else {
        conditions.push({ name: 'Further evaluation needed', probability: 0.4 });
        advice = 'Please provide more specific symptoms or consult a healthcare professional.';
    }

    return { conditions, advice };
}

// New route for chatbot diagnosis
app.post('/api/chatbot/diagnosis', async (req, res) => {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
        return res.status(400).json({ message: 'Please provide a list of symptoms.' });
    }

    try {
        // Integrate your AI-powered diagnosis logic here
        const analysisResult = analyzeSymptoms(symptoms);
        res.json(analysisResult);

        // You might also interact with your database using Mongoose here if needed
        // const medicalData = await MedicalModel.find({ /* your query based on symptoms */ });
        // ... process medicalData ...

        // Potentially interact with external APIs like healthcare.gov
        // (Remember that healthcare.gov might not directly provide diagnostic information)
        // const healthcareData = await fetch('https://api.healthcare.gov/...');
        // const healthcareJson = await healthcareData.json();
        // ... incorporate healthcareJson into your response ...

    } catch (error) {
        logger.error('Error processing chatbot diagnosis:', error);
        res.status(500).json({ message: 'Failed to process your request.' });
    }
});
// Routes
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
