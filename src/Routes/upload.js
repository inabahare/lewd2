import express     from "express";
import * as upload from "../Controllers/upload";

const router = express.Router();

router.post("/", upload.index.post);

export default router;