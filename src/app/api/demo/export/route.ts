import { listProjects } from "@/lib/mock-data";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";

function csvCell(value: string | number) {
  const text = String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const { tenant, requestId } = await getTenantContext();
  const rows = listProjects(tenant);
  const header = [
    "id",
    "name",
    "status",
    "requests",
    "error_rate",
    "p95_ms",
    "updated_at",
  ];
  const lines = [
    header.map(csvCell).join(","),
    ...rows.map((project) =>
      [
        project.id,
        project.name,
        project.status,
        project.requests,
        project.errorRate,
        project.p95,
        project.updatedAt,
      ]
        .map(csvCell)
        .join(","),
    ),
  ];

  return new Response(`\uFEFF${lines.join("\n")}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${tenant}-projects.csv"`,
      "cache-control": "no-store",
      "x-lab-request-id": requestId,
    },
  });
}
