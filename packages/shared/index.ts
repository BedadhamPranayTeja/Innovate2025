import { z } from 'zod';

export const ExampleSchema = z.object({
    message: z.string()
});

export type Example = z.infer<typeof ExampleSchema>;
