import express from 'express'
import plaidRouter from './api/plaid';

const app = express();

app.use('/', plaidRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Payment Server Started on port ${port}`))
