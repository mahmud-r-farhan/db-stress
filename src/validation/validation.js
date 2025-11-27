import { z } from "zod";

const schema = z.object({
  mode: z.enum(["db", "api"]),
  amount: z.number().int().min(1).max(1_000_000),
  concurrency: z.number().int().min(1).max(500),
  dbType: z.enum(["mongodb", "postgres"]).optional(),
  connectionString: z.string().optional(),
  apiUrl: z.string().url().optional()
});

export function validateConfig(input) {
  const result = schema.safeParse(input);

  if (!result.success) {
    console.error("\n❌ Invalid input\n");
    console.log(result.error.format());
    process.exit(1);
  }

  return result.data;
}
