import { object, string, TypeOf, z } from 'zod';

function isStrongPassword(password: string): boolean {
  if (password === "" || password === null || password.length < 8) {
    return false;
  }

  //Checks if password includes Uppercase, Lowercase
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    return false;
  }

  //Checks if password includes special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password) || password.includes(' ')) {
    return false;
  }

  return true;
}

enum AuthProvider {
  Email,
  Google
}


export const signupSchema = z.object({
  //id: z.number(),
  userName: z.string(),
  email: z.string().email(),
  password: z.string()
    .refine(value => isStrongPassword(value), { message: 'Password must contain at least one uppercase letter, ' +
    'one lowercase letter, one digit and one special character and must be greater than 8 characters'}),
  confirmPassword: z.string()
    .refine(value => isStrongPassword(value), { message: 'Password must contain at least one uppercase letter, ' +
    'one lowercase letter, one digit and one special character and must be greater than 8 characters'}),
  authProvider: z.nativeEnum(AuthProvider),
})
.refine(data => data.password === data.confirmPassword, {
  message: "The passwords did not match",
  path: ['confirmPassword'] // This is where the error will be attached in the resulting error object
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  //id: z.optional(z.number()),
  code: z.string(),
});

export const resetPasswordSchema = z.object({
  code: z.string(),
  password: z.string()
    .refine(value => isStrongPassword(value), { message: 'Password must contain at least one uppercase letter, ' +
    'one lowercase letter, one digit and one special character and must be greater than 8 characters'}),
  confirmPassword: z.string()
    .refine(value => isStrongPassword(value), { message: 'Password must contain at least one uppercase letter, ' +
    'one lowercase letter, one digit and one special character and must be greater than 8 characters'})
}).refine(data => data.password === data.confirmPassword, {
  message: "The passwords did not match",
  path: ['confirmPassword']
});

export const emailSchema = z.object({
  email: z.string().email()
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string()
});

export const googleAuthTokenSchema = z.object({
  authToken: z.string()
});

export type SignupSchemaType = TypeOf<typeof signupSchema>;

/*export type SignupSchemaType = Omit<
  TypeOf<typeof signupSchema>,
  "body.confirmPassword"
>;*/
export type LoginUserInput = TypeOf<typeof loginUserSchema>;
export type VerifyEmailType = TypeOf<typeof verifyEmailSchema>;
export type EmailType = TypeOf<typeof emailSchema>;
export type ResetPasswordType = TypeOf<typeof resetPasswordSchema>;
export type RefreshTokenType = TypeOf<typeof refreshTokenSchema>;


