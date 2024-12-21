import express from "express"
import { createUser,getuser,getuserbyid,updateuser,deleteuser } from "../controllers/userController"

// สร้าง express router
const router = express.Router()

// สร้าง route สำหรับสร้าง user
router.post("/", createUser)

router.get("/:Userid",getuserbyid)

router.put("/:Userid",updateuser)
router.get("/",getuser)

router.delete("/:Userid",deleteuser)
// สร้าง route สำหรับดึงข้อมูล user ทั้งหมด
// router.get("/", getUsers)

// // สร้าง route สำหรับดึงข้อมูล user ตาม id
// router.get("/:userId", getUserById)

// // สร้าง route สำหรับอัพเดทข้อมูล user ตาม id
// router.put("/:userId", updateUser)

// // สร้าง route สำหรับลบข้อมูล user ตาม id
// router.delete("/:userId", deleteUser)


export default router