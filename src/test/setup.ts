import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock para crypto.randomUUID se necessário em ambiente node/jsdom antigo
if (!global.crypto) {
  // @ts-ignore
  global.crypto = {
    randomUUID: () => "550e8400-e29b-41d4-a716-446655440000" as any
  };
}
