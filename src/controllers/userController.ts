import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import * as Joi from 'joi'

// สร้าง instance ของ PrismaClient
const prisma = new PrismaClient()

// Interface สำหรับรับ request body จาก client
interface UserInput {
    email: string
    firstName: string
    lastName: string
    social: {
      facebook?: string
      twitter?: string
      github?: string
      website?: string
    }
}




const createUser = async (req:Request,res:Response)=>{ 

  const UserInput : UserInput = req.body
  console.log(UserInput)

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
  const user = await prisma.user.create({
    data:{
      email:UserInput.email,
      firstName:UserInput.firstName,
      lastName:UserInput.lastName,
      social:UserInput.social

    }
  })
  res.json(user)
 } catch(err){
  console.log((err as Error).message)
  res.status(500).json({erre:'สร้างผู้ใช้งานไม่สำเร็จ'})

 }

}

const updateuser = async (req:Request,res:Response)=>{
  const Userid = parseInt(req.params.Userid);
  const UserInput : UserInput = req.body
  console.log(Userid)
  console.log(UserInput)



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
    const { error } = schema.validate(UserInput)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

  

    try {
      const user = await prisma.user.update({
        where: {
          id: Userid,
        },
        data: UserInput,
      })
      res.json(user)
    } catch (e) {
      console.error((e as Error).message)
      res.status(500).json({ error: "Failed to update user" })
    }
}

const getuser = async (req:Request,res:Response)=>{

  try {
    const  users= await prisma.user.findMany()
    res.json(users)
   }catch(err){
    console.error((err as Error).message)
    res.status(500).json({eror:"ค้นหา ผู้ใช้งานไม่สำเร็จ"})
   }
  }

  const getuserbyid = async (req:Request,res:Response)=>{
    const Userid = parseInt(req.params.Userid);
    console.log(Userid)
    try{
      
      const user = await prisma.user.findUnique({
        where:{
          id: Userid,
        },
      })
      if(!user){
        return res.status(404).json({eror:"ค้นหา ผู้ใช้งานไม่สำเร็จ ตามไอดี"})
      }
      res.json(user)
    } catch (err){
      console.error((err as Error).message)
      res.status(500).json({eror:`ค้นหา ผู้ใช้งานไม่สำเร็จตามไอดี  ${Userid}`})
     
    }
  }

  const deleteuser = async (req:Request,res:Response)=>{
    const Userid = parseInt(req.params.Userid);
    const UserInput : UserInput = req.body
    console.log(Userid)
    console.log(UserInput)
  
      try {
        const user = await prisma.user.delete({
          where: {
            id: Userid,
          }
        })
        res.json(`ทำกานลบสำเร็จ ${UserInput.firstName}`)
      } catch (e) {
        console.error((e as Error).message)
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบ" })
      }
  }
  





  export { createUser,getuser,getuserbyid,updateuser,deleteuser }


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

