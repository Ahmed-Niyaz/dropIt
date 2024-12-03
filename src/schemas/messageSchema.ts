import { z } from "zod";

export const messageSchema = z.object({
    content: z.string().min(1, {message: 'Min one character is required to send message'}).max(500, {message: 'Reached max characters(500 characters)'}) 
})