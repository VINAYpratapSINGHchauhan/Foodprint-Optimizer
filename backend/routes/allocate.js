import { Router } from "express";
import { allocateSurplus, computeRoute } from "../controllers/routeController.js";

const router = Router();

// Accept allocation request, persist allocation in Firestore using admin SDK
router.post("/allocate", async (req, res) => {
  try {
    const { surplus, ngos, restaurant } = req.body; // restaurant optional metadata
    const result = allocateSurplus(surplus, ngos);
    // Persist
    const db = req.app.locals.db;
    const docRef = await db.collection("allocations").add({
      createdAt: new Date().toISOString(),
      restaurant: restaurant || null,
      allocated: result.allocated,
      leftover: result.leftover
    });
    res.json({ id: docRef.id, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});

router.post("/route-optimize", (req, res) => {
  try {
    const { start, stops } = req.body;
    const route = computeRoute(start, stops);
    res.json({ route });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});

export default router;