// firebaseAdmin.ts
import * as admin from "firebase-admin";
import serviceAccount from "loja-f2c5b-firebase-adminsdk-fbsvc-04050f7042.json";

// Verifica se o Firebase Admin já foi inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://loja-f2c5b-default-rtdb.firebaseio.com/",
  });
}

// Exporta o Firebase Admin para ser usado em outros lugares
export default admin;