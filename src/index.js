import express from 'express'
import { plaidRouter, getStripeBankAccount, getAccessToken } from './api/plaid';
import { getPaymentDetails } from './api/payment/details';
import * as Stripe from 'api/stripe';

const app = express();
app.use(express.json());

// app.use('/', plaidRouter);

app.get('/', (req, res) => res.status(200).send('OK'));

app.get('/payment/:id', async (req, res) => {
  const paymentDetails = await getPaymentDetails(req.params.id);
  res.status(200).send(JSON.stringify({amount: paymentDetails.amount}));
})

app.post('/pay', async (req, res) => {
  const { public_token, account_id, paymentId, customer } = req.body;
  const bankAcct = await getStripeBankAccount(await getAccessToken(public_token), account_id);
  const paymentDetails = await getPaymentDetails(paymentId);
  const amount = paymentDetails.amount * 100;
  if (customer.id) {
    await Stripe.chargeUsd({
      amount,
      customerId: customer.id,
      source: customer.source,
    });
  } else {
    const {email, phone, firstName, lastName, dob} = customer;
    const stripeCustomer = await Stripe.createCustomer({
      name: `${firstName} ${lastName}`,
      email,
      phone,
      source: bankAcct,
      description: `via Plaid`,
    })
    await Stripe.chargeUsd({
      amount,
      customerId: stripeCustomer.id,
    });
  }

  res.sendStatus(201);
})

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Payment Server Started on port ${port}`))
