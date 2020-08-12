import express from "express";
import * as login from "/Controllers/login";

const router = express.Router();

router.get("/", login.index.get);
router.post("/", login.index.post);

////////////////////
// RESET PASSWORD //
////////////////////
router.get("/forgot-password/:token", login.resetPassword.get);
router.post("/reset-password",        login.resetPassword.validate,
                                      login.resetPassword.post);

export default router;

