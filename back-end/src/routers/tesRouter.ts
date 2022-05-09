import { Router } from "express";
import * as testController from "../controllers/testController.js";
const testRouter = Router();

testRouter.delete("/recommendations", testController.clearRecommendations);

export default testRouter;