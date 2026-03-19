import { Router, Request, Response } from 'express';
import { generateTestCases, testConnection, LLMConfig } from '../services/llm.service';

const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
    try {
        const { requirement, config } = req.body;
        
        if (!requirement || !config || !config.provider) {
             res.status(400).json({ error: 'Missing requirement or provider configuration' });
             return;
        }

        const tests = await generateTestCases(requirement, config as LLMConfig);
        res.json({ result: tests });
    } catch (error: any) {
        const details = error?.response?.data?.error?.message || error?.response?.data?.error || error.message;
        console.error("Error generating test cases:", details);
        res.status(500).json({ error: 'Failed to generate test cases', details: details });
    }
});

router.post('/test-connection', async (req: Request, res: Response) => {
    try {
        const { config } = req.body;
        if (!config || !config.provider) {
             res.status(400).json({ error: 'Missing provider configuration' });
             return;
        }

        const success = await testConnection(config as LLMConfig);
        if (success) {
             res.json({ message: 'Connection successful', success: true });
        } else {
             res.status(400).json({ error: 'Connection failed', success: false, details: 'The AI provider rejected the request. Please check your URL/Keys and ensure the Model exists.' });
        }
    } catch (error: any) {
        const details = error?.response?.data?.error?.message || error?.response?.data?.error || error.message;
        res.status(500).json({ error: 'Connection test error', details: details, success: false });
    }
});

export default router;
