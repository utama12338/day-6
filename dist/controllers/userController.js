"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteuser = exports.updateuser = exports.getuserbyid = exports.getuser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const Joi = __importStar(require("joi"));
// สร้าง instance ของ PrismaClient
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const UserInput = req.body;
    console.log(UserInput);
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'กรุณากรอกอีเมลที่ถูกต้อง',
            'any.required': 'กรุณากรอกอีเมล'
        }),
        firstName: Joi.string().required(),
        lastName: Joi.string().required().messages({
            'any.required': 'กรุณากรอกนามสกุล'
        }),
        social: Joi.object({
            facebook: Joi.string().uri().messages({
                'string.uri': 'กรุณากรอก Facebook ที่ถูกต้อง'
            }),
            twitter: Joi.string().uri().messages({
                'string.uri': 'กรุณากรอก Twitter ที่ถูกต้อง'
            }),
            github: Joi.string().uri().messages({
                'string.uri': 'กรุณากรอก Github ที่ถูกต้อง'
            }),
            website: Joi.string().uri().messages({
                'string.uri': 'กรุณากรอก Website ที่ถูกต้อง'
            })
        })
    });
    // เช็คความถูกต้อง
    const { error } = schema.validate(UserInput);
    if (error) {
        // สร้างอาร์เรย์ของข้อความข้อผิดพลาดทั้งหมด
        const errorMessages = error.details.map(detail => detail.message);
        // ส่งคืนข้อผิดพลาดทั้งหมดใน response
        return res.status(400).json({ errors: errorMessages });
    }
    try {
        const user = yield prisma.user.create({
            data: {
                email: UserInput.email,
                firstName: UserInput.firstName,
                lastName: UserInput.lastName,
                social: UserInput.social
            }
        });
        res.json(user);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ erre: 'สร้างผู้ใช้งานไม่สำเร็จ' });
    }
});
exports.createUser = createUser;
const updateuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Userid = parseInt(req.params.Userid);
    const UserInput = req.body;
    console.log(Userid);
    console.log(UserInput);
    // Validate the request body
    const schema = Joi.object({
        email: Joi.string().email(),
        firstName: Joi.string(),
        lastName: Joi.string(),
        social: Joi.object({
            facebook: Joi.string().uri(),
            twitter: Joi.string().uri(),
            github: Joi.string().uri(),
            website: Joi.string().uri()
        })
    });
    // If the request body is invalid, return 400 Bad Request
    const { error } = schema.validate(UserInput);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const user = yield prisma.user.update({
            where: {
                id: Userid,
            },
            data: UserInput,
        });
        res.json(user);
    }
    catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Failed to update user" });
    }
});
exports.updateuser = updateuser;
const getuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.json(users);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ eror: "ค้นหา ผู้ใช้งานไม่สำเร็จ" });
    }
});
exports.getuser = getuser;
const getuserbyid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Userid = parseInt(req.params.Userid);
    console.log(Userid);
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: Userid,
            },
        });
        if (!user) {
            return res.status(404).json({ eror: "ค้นหา ผู้ใช้งานไม่สำเร็จ ตามไอดี" });
        }
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ eror: `ค้นหา ผู้ใช้งานไม่สำเร็จตามไอดี  ${Userid}` });
    }
});
exports.getuserbyid = getuserbyid;
const deleteuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Userid = parseInt(req.params.Userid);
    const UserInput = req.body;
    console.log(Userid);
    console.log(UserInput);
    try {
        const user = yield prisma.user.delete({
            where: {
                id: Userid,
            }
        });
        res.json(`ทำกานลบสำเร็จ ${UserInput.firstName}`);
    }
    catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบ" });
    }
});
exports.deleteuser = deleteuser;
/*
// Create a new user
// POST /users
const createUser = async (req: Request, res: Response) => {
  
    const userInput: UserInput = req.body
    console.log(userInput)

    // Validate the request body
    const schema = Joi.object({
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        social: Joi.object({
            facebook: Joi.string().uri(),
            twitter: Joi.string().uri(),
            github: Joi.string().uri(),
            website: Joi.string().uri()
        })
    })

    // If the request body is invalid, return 400 Bad Request
    const { error } = schema.validate(userInput)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    // Create a new user
    try {
        const user = await prisma.user.create({
            data: {
                email: userInput.email,
                firstName: userInput.firstName,
                lastName: userInput.lastName,
                social: userInput.social,
            }
        })
        res.json(user)
    } catch (e) {
        console.error((e as Error).message)
        res.status(500).json({ error: 'Failed to create user'})
    }
}

// Get all users
// GET /users
const getUsers = async (_: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany()
      res.json(users)
    } catch (e) {
      console.error((e as Error).message)
      res.status(500).json({ error: "Failed to get users" })
    }
}

// GET /users/:userId: Get a user by ID
const getUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId)
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }
      res.json(user)
    } catch (e) {
      console.error((e as Error).message)
      res.status(500).json({ error: "Failed to get user" })
    }
}

// PUT /users/:userId: Update a user by ID
const updateUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId)
    const userInput: UserInput = req.body

    // Validate the request body
      const schema = Joi.object({
        email: Joi.string().email(),
        firstName: Joi.string(),
        lastName: Joi.string(),
        social: Joi.object({
            facebook: Joi.string().uri(),
            twitter: Joi.string().uri(),
            github: Joi.string().uri(),
            website: Joi.string().uri()
        })
    })

    // If the request body is invalid, return 400 Bad Request
    const { error } = schema.validate(userInput)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    try {
      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: userInput,
      })
      res.json(user)
    } catch (e) {
      console.error((e as Error).message)
      res.status(500).json({ error: "Failed to update user" })
    }
}

// DELETE /users/:userId: Delete a user by ID
const deleteUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId)
    try {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      })
      res.json({ message: "User deleted successfully" })
    } catch (e) {
      console.error((e as Error).message)
      res.status(500).json({ error: "Failed to delete user" })
    }
}

export { createUser, getUsers, getUserById, updateUser, deleteUser }

*/
//# sourceMappingURL=userController.js.map