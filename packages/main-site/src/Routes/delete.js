import express from "express";
import * as deleteFile from "/Controllers/delete/delete";

const router = express.Router();

router.get("/:key", deleteFile.get);

export default router;