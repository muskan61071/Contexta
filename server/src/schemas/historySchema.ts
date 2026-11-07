import {z} from 'zod';
export const historyIdSchema=z.string().uuid('Invalid analysis id.');
