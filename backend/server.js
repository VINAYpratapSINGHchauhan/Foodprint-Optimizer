import express from "express";
import cors from "cors";
import allocateRoutes from "./routes/allocate.js";
import admin from "firebase-admin";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin via JSON env or GOOGLE_APPLICATION_CREDENTIALS file
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} else {
  // fallback to default application credentials (GOOGLE_APPLICATION_CREDENTIALS)
  admin.initializeApp();
}
const db = admin.firestore();
app.locals.db = db;

app.get("/", (_, res) => res.json({ status: "ok" }));
app.use("/api", allocateRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log("Backend running on", PORT));