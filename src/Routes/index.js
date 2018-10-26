import express    from "express";
import * as index from "../Controllers/index";

const router = express.Router();

// Transform the result json from string to array
// For the benifit of those who have JS disabled
router.use((req, res, next) => {
  if (res.locals.message)
    if (res.locals.message.uploadData)
      res.locals.message.uploadData = JSON.parse(res.locals.message.uploadData);
  
  next();
})

router.get("/",             index.index.get);
router.get("/info",         index.info.get);
router.get("/transparency", index.transparency.get);
router.get("/lewd.sxcu",    index.sharex.get);

export default router;