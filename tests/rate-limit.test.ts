import { beforeEach, describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

const WINDOW = 10 * 60 * 1000;

describe("checkRateLimit", () => {
  beforeEach(() => resetRateLimit());

  it("permite `limit` intentos y bloquea el siguiente dentro de la ventana", () => {
    const t0 = 1_000_000;
    expect(checkRateLimit("booking:1.1.1.1", 3, WINDOW, t0)).toBe(true);
    expect(checkRateLimit("booking:1.1.1.1", 3, WINDOW, t0 + 1)).toBe(true);
    expect(checkRateLimit("booking:1.1.1.1", 3, WINDOW, t0 + 2)).toBe(true);
    expect(checkRateLimit("booking:1.1.1.1", 3, WINDOW, t0 + 3)).toBe(false);
  });

  it("reabre el cubo cuando expira la ventana", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 3; i++) checkRateLimit("k", 3, WINDOW, t0);
    expect(checkRateLimit("k", 3, WINDOW, t0 + WINDOW - 1)).toBe(false);
    expect(checkRateLimit("k", 3, WINDOW, t0 + WINDOW)).toBe(true);
  });

  it("las claves son independientes", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 3; i++) checkRateLimit("a", 3, WINDOW, t0);
    expect(checkRateLimit("a", 3, WINDOW, t0)).toBe(false);
    expect(checkRateLimit("b", 3, WINDOW, t0)).toBe(true);
  });
});
