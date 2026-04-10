import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Example: Validate order creation
export const onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    
    // Here you would:
    // 1. Verify stock availability
    // 2. Decrement stock
    // 3. Send confirmation email
    // 4. Generate invoice
    
    console.log(`New order created: ${context.params.orderId}`, order);
    return null;
  });

// Example: Assign admin role securely
export const assignAdminRole = functions.https.onCall(async (data, context) => {
  // Check if requester is an admin
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can assign roles.'
    );
  }

  const { email } = data;
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    // Also update Firestore document
    await admin.firestore().collection('users').doc(user.uid).update({
      role: 'admin'
    });

    return { message: `Success! ${email} has been made an admin.` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error assigning role');
  }
});
