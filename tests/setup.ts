import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

type IOCallback = (entries: IntersectionObserverEntry[]) => void;

declare global {
  // The stub below records observers so tests can drive the callback and
  // inspect which element was observed.
  var __ioCallbacks: IOCallback[];
  var __ioObserved: Element[];
}

globalThis.__ioCallbacks = [];
globalThis.__ioObserved = [];

class TestIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  private readonly callback: IOCallback;

  constructor(callback: IOCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    if (!globalThis.__ioCallbacks.includes(this.callback)) {
      globalThis.__ioCallbacks.push(this.callback);
    }
    globalThis.__ioObserved.push(target);
  }

  unobserve() {}

  disconnect() {
    const index = globalThis.__ioCallbacks.indexOf(this.callback);
    if (index >= 0) globalThis.__ioCallbacks.splice(index, 1);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver =
  TestIntersectionObserver as unknown as typeof IntersectionObserver;

beforeEach(() => {
  globalThis.__ioCallbacks.length = 0;
  globalThis.__ioObserved.length = 0;
});
