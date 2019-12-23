import stripe from "config/stripe";

export async function createCustomer({email, name, source, description, metadata, phone }) {
  return stripe.customers.create({
    email,
    name,
    source,
    description,
    metadata,
    phone,
  })
}
