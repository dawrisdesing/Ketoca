const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

admin.initializeApp();

exports.enviarNotificacionPago = onDocumentCreated('pagos/{pagoId}', async (event) => {
  const snap = event.data;
  if (!snap) {
    console.log('No hay datos asociados al evento.');
    return null;
  }

  const data = snap.data();
  const receptorId = data.receptorId;
  const pagador = data.nombrePagador || 'Alguien';
  const importe = data.importe || '0.00';
  const grupo = data.nombreGrupo || 'el grupo';

  try {
    // 1. Obtener el token FCM del receptor
    const tokenDoc = await admin.firestore().collection('tokens').doc(String(receptorId)).get();
    if (!tokenDoc.exists) {
      console.log('No hay token registrado para el receptor:', receptorId);
      return null;
    }

    const fcmToken = tokenDoc.data().token;

    // 2. Construir la notificación push
    const message = {
      token: fcmToken,
      notification: {
        title: '💸 Pago recibido en KETOCA',
        body: `${pagador} te ha enviado €${importe} en ${grupo}.`
      },
      data: {
        grupoId: String(data.grupoId || ''),
        click_action: 'https://www.appketoca.com'
      }
    };

    // 3. Enviar el mensaje push
    const response = await admin.messaging().send(message);
    console.log('Notificación enviada con éxito:', response);
    return response;
  } catch (error) {
    console.error('Error al enviar notificación FCM:', error);
    return null;
  }
});