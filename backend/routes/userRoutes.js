import  Express  from "express";
import{createUser} from "../controllers/userController.js";


const router= Express.Router()


router.route('/').post(createUser);


export default router;