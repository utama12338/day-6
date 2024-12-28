"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
// สร้าง express router
const router = express_1.default.Router();
// สร้าง route สำหรับสร้าง user
router.post("/", userController_1.createUser);
router.get("/:Userid", userController_1.getuserbyid);
router.put("/:Userid", userController_1.updateuser);
router.get("/", userController_1.getuser);
router.delete("/:Userid", userController_1.deleteuser);
// สร้าง route สำหรับดึงข้อมูล user ทั้งหมด
// router.get("/", getUsers)
// // สร้าง route สำหรับดึงข้อมูล user ตาม id
// router.get("/:userId", getUserById)
// // สร้าง route สำหรับอัพเดทข้อมูล user ตาม id
// router.put("/:userId", updateUser)
// // สร้าง route สำหรับลบข้อมูล user ตาม id
// router.delete("/:userId", deleteUser)
exports.default = router;
//# sourceMappingURL=userRoutes.js.map