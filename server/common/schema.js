const z = require('zod');




const registerSchema = z.object({
  username:z.string()
            .min(3,"Username must be at least 3 characters long")
            .max(100,'You have exceeded the maximum name length')
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
  userDetail: z.string()
    .min(3, "Username must be at least 3 characters long")
    .max(100, 'You have exceeded the maximum name length')
    .transform((val) => val.trim())
    .refine((val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val) || val.length >= 3;
    }, "Must be a valid email or username"),

  password: z.string()
    .nonempty("Password is required")
    .transform((val) => val.trim()),
});


module.exports = {
    registerSchema,
    loginSchema
}