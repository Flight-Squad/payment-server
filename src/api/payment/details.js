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
  const customerColl = db.collection(Collections.customers);
  const customerSnapshot = await customerColl.where(platform, '==', id).get();

  let customer = {};


  if (customerSnapshot.empty) {
    const customerDoc = customerColl.doc()
    await customerDoc.set({
      // platform key = platform user id
      [platform]: id,

      // Could be useful for debugging later
      id: customerDoc.id,
    }, { merge: true });
    customer.id = customerDoc.id;
  } else {
    const customerDoc = customerSnapshot.docs[0];
    customer = customerDoc.data()
    customer.id = customerDoc.id;
  }
  console.log(`platform=${platform} id=${id} ${customerSnapshot.size} customers found. Customer id=${customer.id}`);

  return customer;
}
