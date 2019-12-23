export async function getAccessToken(publicToken) {
  const res = await plaidClient.exchangePublicToken(publicToken);
  return res.access_token;
}

export async function getStripeBankAccount(accessToken, accountId) {
  const res = await plaidClient.createStripeToken(accessToken, accountId);
  return res.stripe_bank_account_token;
}
