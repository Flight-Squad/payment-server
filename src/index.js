import express from 'express'
import cors from 'cors'
import { plaidRouter, getStripeBankAccount, getAccessToken } from './api/plaid';
import { getPaymentDetails, createPaymentDetails } from './api/payment/details';
import * as Stripe from 'api/stripe';

const app = express();

// ONLY FOR DEVELOPMENT
app.use(cors());

// For Production/Staging

// // From https://daveceddia.com/access-control-allow-origin-cors-errors-in-react-express/
// // Set up a whitelist and check against it:
// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// // Then pass them to cors:
// app.use(cors(corsOptions));

app.use(express.json());

// app.use('/', plaidRouter);

app.get('/', (req, res) => res.status(200).send('OK'));

app.get('/payment/:id', async (req, res) => {
  const paymentDetails = await getPaymentDetails(req.params.id);
  res.status(200).send(JSON.stringify({ amount: paymentDetails.amount }));
})

/**
 * Takes 3 fields in POST body: user: Object, amount: number, tripId: string
 *
 * `amount` is formatted as USD in dollars
 *
 * `user` must have an `id` and a `platform` field
 *
 * `tripId` is treated as paymentId
 *
 * For non automated orders, platform should be 'stripe' and `id` should be their stripe customer id
 *
 * Creates Payment details document
 */
app.post('/payment', async (req, res) => {
  const { user, amount, tripId } = req.body;

  // payment doc id
  const details = await createPaymentDetails(user, amount, tripId);

  res.status(201).send(JSON.stringify(details))
})

app.post('/pay', async (req, res) => {
  const { public_token, account_id, paymentId, customer } = req.body;
  const bankAcct = await getStripeBankAccount(await getAccessToken(public_token), account_id);

  const paymentDetails = await getPaymentDetails(paymentId);
  const stripeId = await Stripe.getStripeId(paymentDetails.customer.id, {...customer, bankAcct});

  const amount = paymentDetails.amount * 100;

  await Stripe.chargeUsd({
    amount,
    customerId: stripeId,
    source: bankAcct,
  });

  res.sendStatus(201);
})

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Payment Server Started on port ${port}`))
