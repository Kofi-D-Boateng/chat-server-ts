import * as redis from "redis";

export const _init = async (Url: string) => {
  const client: redis.RedisClientType = redis.createClient({
    url: Url,
  });
  client.connect();
  return client;
};

export const _closeConnection = (client: redis.RedisClientType) => {
  client.disconnect();
};
