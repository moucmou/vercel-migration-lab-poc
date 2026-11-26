export function newRequestId() {
  return crypto.randomUUID();
}

export function logEvent(
  event: string,
  fields: Record<string, unknown> = {},
) {
  console.log(
    JSON.stringify({
      level: "info",
      event,
      at: new Date().toISOString(),
      ...fields,
    }),
  );
}

export function logError(
  event: string,
  error: unknown,
  fields: Record<string, unknown> = {},
) {
  console.error(
    JSON.stringify({
      level: "error",
      event,
      at: new Date().toISOString(),
      message: error instanceof Error ? error.message : String(error),
      ...fields,
    }),
  );
}
