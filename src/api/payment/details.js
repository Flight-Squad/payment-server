import { db, Collections } from "../../config/firestore";
import moment from 'moment-timezone'


export async function getPaymentDetails(paymentId) {
  const snapshot = await db.collection(Collections.paymentDetails).doc(paymentId).get();
  return snapshot.data()
}

/**
 *
 * @param {*} customer If prior customer, include customer id
 * @param {*} amount in US Dollars
 */
export async function createPaymentDetails({ user, amount, tripId, tripInfo }) {
  const docData = {
    amount: Number(amount).toFixed(2),
    customer: await getUser(user),
    tripInfo,
  }

  const doc = db.collection(Collections.paymentDetails).doc(tripId);
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

/**
 * Take ISO String (from `date`) like `'2011-10-05T14:48:00.000Z'`
 *
 * and turn it into `'2011-10-05'`
 * @param date
 */
function formatDateAsKebab(date) {
  // split on 'T' and return first element string array
  return date.toISOString().split('T')[0]
}
