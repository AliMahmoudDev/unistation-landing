import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default client;

export async function getConfig<T = any>(key: string): Promise<T | null> {
  const result = await client.execute({
    sql: "SELECT value FROM site_config WHERE key = ?",
    args: [key],
  });
  if (result.rows.length === 0) return null;
  return JSON.parse(result.rows[0].value as string) as T;
}

export async function setConfig(key: string, value: any): Promise<void> {
  const json = JSON.stringify(value);
  await client.execute({
    sql: `INSERT INTO site_config (key, value) VALUES (?, ?)
          ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = datetime('now')`,
    args: [key, json, json],
  });
}

export async function getAllConfig(): Promise<Record<string, any>> {
  const result = await client.execute("SELECT key, value FROM site_config");
  const config: Record<string, any> = {};
  for (const row of result.rows) {
    config[row.key as string] = JSON.parse(row.value as string);
  }
  return config;
}
