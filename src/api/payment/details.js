import { db, Collections } from "../../config/firestore";


export async function getPaymentDetails(paymentId) {
  const snapshot = await db.collection(Collections.paymentDetails).doc(paymentId).get();
  return snapshot.data()
}

/**
 *
 * @param {*} customer If prior customer, include customer id
 * @param {*} amount in US Dollars
 */
export async function createPaymentDetails(user, chargeAmount, paymentId) {
  const docData = {
    amount: Number(chargeAmount).toFixed(2),
    customer: await getUser(user),
  }

  const doc = db.collection(Collections.paymentDetails).doc(paymentId);
  await doc.set(docData, { merge: true });
  return { id: doc.id, ...docData };
}

/**
 * Returns first customer where their platform id is equal
 * to provided id.
 *
 * Creates new customer if no matches are found.
 * @param {*} param0
 */
async function getUser({ id, platform }) {
  const customerColl = db.collection('customers');
  const customerSnapshot = await customerColl.where(platform, '==', id).get();

  const customer = {};

  if (customerSnapshot.empty) {
    const customerDoc = customerColl.doc()
    await customerDoc.set({
      [platform]: id,
    });
    customer.id = customerDoc.id;
  } else {
    const customerDoc = customerSnapshot.docs[0];
    const { email, name } = customerDoc.data()
    customer.id = customerDoc.id;
    customer.email = email || null;
    customer.name = name || null;
  }

  return customer;
}
