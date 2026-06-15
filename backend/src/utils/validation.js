const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }).trim(),
  email: z.string().email({ message: 'Invalid email format' }).trim().toLowerCase(),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  role: z.enum(['user', 'admin']).optional().default('user')
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }).trim().toLowerCase(),
  password: z.string().min(1, { message: 'Password is required' })
});

module.exports = {
  registerSchema,
  loginSchema
};
