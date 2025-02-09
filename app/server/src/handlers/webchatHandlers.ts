import { llmAgentHost } from 'app/shared/env';
import { Request, Response } from 'express';

export const llmBaseUrl = `http://localhost:${llmAgentHost}`;

export const postGenerateHandler = async (req: Request, res: Response): Promise<void> => {
    const { message, sessionId } = req.body;
    try {
        const payload = {
            sessionId: sessionId,
            model: "x-care-uncle",
            prompt: message
        };

        const response = await fetch(`${llmBaseUrl}/agent/generate`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${req.headers.authorization}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        }

    } catch (error) {
        console.error('Failed to generate response', error);
        res.status(500).json({ success: false });
    }
};

export const postLoginHandler = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const payload = {
            username: username,
            password: password
        };

        const response = await fetch(`${llmBaseUrl}/agent/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        }

    } catch (error) {
        console.error('Failed to login', error);
        res.status(500).json({ success: false });
    }
};

export const getTicketsHandler = async (req: Request, res: Response): Promise<void> => {
    const { createdBy } = req.query;
    try {
        const response = await fetch(`${llmBaseUrl}/agent/tickets`, {
            headers: {
                'Authorization': `Bearer ${req.headers.authorization}`,
            },
        });

        // Filter out tickets by createdBy
        const data = await response.json();
        const tickets = data.filter((ticket: any) => ticket.createdBy === createdBy);

        res.status(200).json(tickets);
    } catch (error) {
        console.error('Failed to fetch tickets', error);
        res.status(500).json({ success: false });
    }
};

export const postSubmitHandler = async (req: Request, res: Response): Promise<void> => {
    const { message } = req.body;
    try {
        const payload = {
            message: message
        };

        const response = await fetch(`${llmBaseUrl}/agent/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            res.status(200).json({ success: true });
        }

    } catch (error) {
        console.error('Failed to submit message', error);
        res.status(500).json({ success: false });
    }
}
