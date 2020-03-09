import express                                  from "express";
import * as register from "../Controllers/register";

const router = express.Router();

router.get("/", register.index.get);


router.get("/:token", register.register.get);
router.post("/",      register.register.validate,
                      register.register.post);

export default router;