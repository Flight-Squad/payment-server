import { db, Collections } from "../../config/firestore";


export async function getPaymentDetails(paymentId) {
  const snapshot = await db.collection(Collections.paymentDetails).doc(paymentId).get();
  return snapshot.data()
}
