import {z} from 'zod';

export const messageSchema = z.object({
    contect: z.string()
    .min(10, {message: "Content must be atleast of 10 charaters"})
    .max(300,{message: "Contant must be no longer than 300 characters"})
})
