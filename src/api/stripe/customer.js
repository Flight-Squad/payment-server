import stripe from "config/stripe";

export async function createCustomer({email, name, source, description, metadata, phone }) {
  stripe.customers.create({
    email,
    name,
    source,
    description,
    metadata,
    phone,
  })
}
