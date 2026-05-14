import { z } from 'zod';

export const queryReplySchema = z.object({
    message: z.string().min(1, "Message is required").max(1000, "Message is too long"),
    attachments: z.array(z.string()).optional(),
});

export type QueryReplyFormData = z.infer<typeof queryReplySchema>;

export const queryStatusSchema = z.object({
    status: z.enum(['Open', 'Pending', 'Resolved', 'Closed']),
});

export type QueryStatusFormData = z.infer<typeof queryStatusSchema>;
