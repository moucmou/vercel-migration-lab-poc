import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export async function GET() {
  const { tenant, requestId } = await getTenantContext();
  const encoder = new TextEncoder();
  const startedAt = Date.now();

  const stream = new ReadableStream({
    async start(controller) {
      for (let index = 1; index <= 5; index += 1) {
        const payload = {
          index,
          tenant,
          requestId,
          elapsedMs: Date.now() - startedAt,
          at: new Date().toISOString(),
        };
        controller.enqueue(
          encoder.encode(`event: tick\ndata: ${JSON.stringify(payload)}\n\n`),
        );
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      controller.enqueue(
        encoder.encode(
          `event: done\ndata: ${JSON.stringify({ requestId, elapsedMs: Date.now() - startedAt })}\n\n`,
        ),
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store",
      "x-lab-stream": "sse",
    },
  });
}
