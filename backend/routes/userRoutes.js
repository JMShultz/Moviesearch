import  Express  from "express";
import{createUser, loginUser, logoutCurrentUser,GetAllUsers,getCurrentUserProfile,UpdateCurrentUserProfile} from "../controllers/userController.js";





//middlewares

import{authenticate,authorizeAdmin} from '../middleware/authmiddleware.js'

const router= Express.Router()


router.route('/').post(createUser).get(authenticate,authorizeAdmin,GetAllUsers);
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);
router.route('/profile').get(authenticate,getCurrentUserProfile).put(authenticate,UpdateCurrentUserProfile);

export default router;