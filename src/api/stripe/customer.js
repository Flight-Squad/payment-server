import stripe from "config/stripe";
import { db, Collections } from "../../config/firestore";

export async function getStripeId(customerDbId, customerDetails) {
  const customerDbDoc = db.collection(Collections.customers).doc(customerDbId);
  const snapshot = await customerDbDoc.get();
  const snapshotData = snapshot.data();

  // If existing stripe customer, return their stripe id
  if (snapshotData.stripe) {
    const cusId = snapshotData.stripe;
    await stripe.customers.update(cusId, {
      default_source: bankAcct
    });

    return cusId
  };

  const { email, phone, firstName, lastName, dob, bankAcct } = customerDetails;
  const stripeCustomer = await createCustomer({
    name: `${firstName} ${lastName}`,
    email,
    phone,
    source: bankAcct,
    description: `via Plaid`,
    metadata: {
      dob,
    },
  });

  // Update details and set stripe customer id for future use
  await customerDbDoc.set({
    ...customerDetails,
    stripe: stripeCustomer.id,
  });

  return stripeCustomer.id;
}

async function createCustomer({ email, name, source, description, metadata, phone }) {
  return stripe.customers.create({
    email,
    name,
    source,
    description,
    metadata,
    phone,
  })
}
