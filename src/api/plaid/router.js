import { Router } from "express";
import plaidClient from "config/plaid";

const plaidRouter = Router();

plaidRouter.get('/exchange/token', async (req, res) => {
  // Plaid naming convention
  const { public_token, account_id } = req.body;
  const tokenExchangeRes = await plaidClient.exchangePublicToken(public_token);
  const accessToken = tokenExchangeRes.access_token;

  const stripeExchangeRes = await plaidClient.createStripeToken(accessToken, account_id);
  const bankAccountToken = stripeExchangeRes.stripe_bank_account_token;


})

export default plaidRouter;
