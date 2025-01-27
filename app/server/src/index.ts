import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const dataFile = path.join(process.cwd(), 'data/data.txt');

app.post('/message', async (req, res) => {
    const { message } = req.body;
    try {
        fs.appendFileSync(dataFile, `${message}\n`);
        console.log({
            path: dataFile,
            message: message,
        });
        res.status(200).json({ success: true });
    } catch (error) {     
        console.error('Failed to write message', error);
        res.status(500).json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});