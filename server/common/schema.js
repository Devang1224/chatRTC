const z = require('zod');




const registerSchema = z.object({
  username:z.string()
            .min(3,"Username must be at least 3 characters long")
            .max(25,'You have exceeded the maximum name length')
            .transform((val) => val.trim()),

  email:z.string().regex(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
    'Invalid Email format',
  ).transform((val) => val.trim()),
  
  password:z.string()
            .regex(
    /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[a-zA-Z]).{8,}$/,
    'Password must be at least 8 characters long, include a special character, and a number',
  ).transform((val) => val.trim()),
  profilePic:z.string().optional()
})

const loginSchema = z.object({
  username:z.string()
            .min(3,"Username must be at least 3 characters long")
            .max(25,'You have exceeded the maximum name length')
            .transform((val) => val.trim()).optional(),
  email:z.string()
         .regex(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
    'Invalid Email format',
  ).transform((val) => val.trim()).or(z.literal("")).optional(),
  password:z.string().nonempty("Password is required").transform((val) => val.trim())
}).refine((data)=>( data.email || data.username ) , {
    message: "Either username or email is required",
})


module.exports = {
    registerSchema,
    loginSchema
}