import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser,loginUser,logoutUser,refreshAccessToken,searchUsers} from "../controllers/user.controller.js";

const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "profilepic",
      maxCount: 1,
    }
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/u/search").post(verifyJWT,searchUsers); 


export default router;
