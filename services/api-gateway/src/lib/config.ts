import { EnvSchema } from '@vayva/shared';
import * as dotenv from 'dotenv';
dotenv.config();

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.format());
    process.exit(1);
}

export const config = parsed.data;
