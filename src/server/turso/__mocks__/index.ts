import type { createClient } from "@libsql/client";
import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

beforeEach(() => {
  mockReset(turso);
});

const turso = mockDeep<typeof createClient>();

export default turso;
