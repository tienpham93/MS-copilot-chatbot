import express from 'express';
import cors from 'cors';
import router from './router';
import { BFFHost } from './env';

const app = express();

app.use(express.json());
app.use(cors());

app.use(router);
app.listen(BFFHost, () => {
    console.log(`BFF server is running at http://localhost:${BFFHost}`);
});