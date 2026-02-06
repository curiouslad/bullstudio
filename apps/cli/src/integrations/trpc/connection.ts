import { createQueueProvider, type QueueService } from "@bullstudio/queue";

let provider: QueueService | null = null;
let providerRedisUrl: string | null = null;
let connectingPromise: Promise<QueueService> | null = null;

function getRedisUrl(): string {
  return process.env.REDIS_URL || "redis://localhost:6379";
}

export const getQueueProvider = async (): Promise<QueueService> => {
  const redisUrl = getRedisUrl();

  // If URL changed, disconnect old provider and create new one
  if (provider && providerRedisUrl !== redisUrl) {
    await provider.disconnect();
    provider = null;
    providerRedisUrl = null;
    connectingPromise = null;
  }

  if (provider) {
    return provider;
  }

  // Deduplicate concurrent calls by reusing the in-flight promise
  if (!connectingPromise) {
    connectingPromise = (async () => {
      const p = await createQueueProvider({ redisUrl });
      providerRedisUrl = redisUrl;
      await p.connect();
      console.log(
        `[CLI] Connected to ${p.getCapabilities().displayName} (${p.providerType})`
      );
      provider = p;
      return p;
    })();
  }

  return connectingPromise;
};

export const disconnectProvider = async (): Promise<void> => {
  if (provider) {
    await provider.disconnect();
    provider = null;
  }
};
