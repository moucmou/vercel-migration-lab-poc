import { unstable_cache } from "next/cache";
import { getMetrics } from "@/lib/mock-data";

export const getCachedMetrics = unstable_cache(
  async (tenant: string) => getMetrics(tenant),
  ["demo-metrics"],
  { revalidate: 30, tags: ["metrics"] },
);
