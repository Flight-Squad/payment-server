import stripe from "config/stripe";

/**
 *
 * @param {number} amount in cents -> should be positive integer
 * @param {string} customerId
 */
export async function chargeUsd({amount, customerId, source}) {
  return stripe.charges.create({
    amount: amount,
    currency: 'usd',
    customer: customerId,
    source,
  });
}
