import express from "express"
import { loginAdmin, loginUser, registerAdmin, registerUser } from "../controllers/auth"
import { addCompeticion, deleteCompetition, getCompetitionByAdmin, getMyCompetition, updateCompetition } from "../controllers/competicion"
import { authenticate } from "../midleware/auth"
import { upload } from "../midleware/multer";
import { joinCompetitionByName } from "../controllers/participant";


export const router = express.Router()

router.post("/register/user", registerUser)
router.post("/register/admin", registerAdmin)
router.post("/login/user", loginUser)
router.post("/login/admin", loginAdmin)


router.get("/competition/me", authenticate ,getCompetitionByAdmin)
router.post("/competition", authenticate, upload.single("material"), addCompeticion);
router.put("/competition/:id", authenticate, upload.single("material"), updateCompetition)
router.delete("/competition/:id", authenticate, deleteCompetition) 

router.get("/participant", authenticate, getMyCompetition)
router.post("/join/competition", authenticate, joinCompetitionByName)


router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  });
});