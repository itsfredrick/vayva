import { Queue } from "bullmq";
import { getRedis } from "./redis";
/**
 * Returns a BullMQ Queue instance safely reusing the Redis connection.
 */
export function getQueue(queueName, options) {
    const connection = getRedis();
    return new Queue(queueName, {
        connection,
        ...options,
    });
}
