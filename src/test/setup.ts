import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock para crypto.randomUUID se necessário em ambiente node/jsdom antigo
if (!global.crypto) {
  // @ts-ignore
  global.crypto = {
    randomUUID: () => Math.random().toString(36).substring(2, 15)
  };
}
