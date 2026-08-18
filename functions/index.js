const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notificarPago = onDocumentCreated("pagos/{pagoId}", async (event) => {
  const snap = event.data;
  if (!snap) {
    console.log("No hay datos en el evento");
    return null;
  }

  const pago = snap.data();

  try {
    // Busca el token en la colección 'tokens' usando el ID del receptor
    const tokenDoc = await admin
      .firestore()
      .collection("tokens")
      .doc(String(pago.receptorId))
      .get();

    if (!tokenDoc.exists || !tokenDoc.data().token) {
      console.log("No hay token para el receptor:", pago.receptorId);
      return null;
    }

    const token = tokenDoc.data().token;

    const mensaje = {
      token: token,
      notification: {
        title: "💸 Pago recibido en KETOCA",
        body: `${pago.nombrePagador} te ha enviado ${pago.importe}€ en ${pago.nombreGrupo}`
      },
      webpush: {
        fcmOptions: {
          link: "/"
        }
      }
    };

    await admin.messaging().send(mensaje);
    console.log("Notificación enviada correctamente al receptor:", pago.receptorId);
  } catch (error) {
    console.error("Error enviando notificación:", error);
  }

  return null;
});