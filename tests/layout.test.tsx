import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "../src/components/SiteLayout";

function renderLayout() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<p>home</p>} />
          <Route path="finance" element={<p>finance</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

test("keeps the published nav order", () => {
  renderLayout();
  const nav = screen.getByRole("navigation", { name: "Primary" });
  expect(within(nav).getAllByRole("link").map((a) => a.textContent)).toEqual([
    "Home", "Finance", "Accomplishments", "Transparency", "About us", "Feedback",
  ]);
});

test("exposes one skip link, one main and the current page", () => {
  renderLayout();
  expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
  expect(screen.getByRole("main")).toHaveAttribute("id", "main");
  expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
});

test("the menu toggle announces and closes on Escape", () => {
  renderLayout();
  const toggle = screen.getByRole("button", { name: "Open menu" });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(toggle);
  const close = screen.getByRole("button", { name: "Close menu" });
  expect(close).toHaveAttribute("aria-expanded", "true");
  expect(close).toHaveAttribute("aria-controls", screen.getByRole("navigation", { name: "Primary" }).id);
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
});

test("Escape returns focus to the menu trigger", () => {
  renderLayout();
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  const finance = within(screen.getByRole("navigation", { name: "Primary" })).getByRole("link", {
    name: "Finance",
  });
  finance.focus();
  expect(finance).toHaveFocus();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.getByRole("button", { name: "Open menu" })).toHaveFocus();
});

test("navigating to another route closes the menu", () => {
  renderLayout();
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
  fireEvent.click(within(screen.getByRole("navigation", { name: "Primary" })).getByRole("link", { name: "Finance" }));
  expect(screen.getByText("finance")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
});

test("the footer names the government and links Facebook", () => {
  renderLayout();
  expect(screen.getByText(/Benigno S\. Aquino National High School Supreme Secondary Learner Government/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /facebook\.com\/SSLGBSANHS/i })).toHaveAttribute("href", "https://www.facebook.com/SSLGBSANHS");
});

test("the opened panel follows the toggle in the document", () => {
  renderLayout();
  const toggle = screen.getByRole("button", { name: "Open menu" });
  // Focus the trigger first: jsdom's click does not move focus, so a click
  // alone would make the post-click assertion below pass vacuously.
  toggle.focus();
  expect(document.activeElement).toBe(toggle);
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  const nav = screen.getByRole("navigation", { name: "Primary" });
  expect(nav).toHaveAttribute("data-open", "true");

  // Opening does not move focus: the trigger keeps it.
  expect(document.activeElement).toBe(toggle);

  // jsdom does not implement sequential focus navigation, so a Tab keydown
  // cannot move focus here. The browser guarantee is the DOM order: the toggle
  // precedes the nav, so forward Tab from the opened trigger enters the panel.
  expect(toggle.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
});

test("the masthead follows the observed sentinel", () => {
  const { container } = renderLayout();
  const masthead = container.querySelector(".masthead");
  expect(masthead).toHaveAttribute("data-scrolled", "false");

  // The stub observed the element the component picked; it must be the sentinel.
  expect(globalThis.__ioObserved.map((el) => el.id)).toContain("top-sentinel");

  const callback = globalThis.__ioCallbacks.at(-1);
  expect(callback).toBeTypeOf("function");

  act(() => callback?.([{ isIntersecting: false } as IntersectionObserverEntry]));
  expect(masthead).toHaveAttribute("data-scrolled", "true");

  act(() => callback?.([{ isIntersecting: true } as IntersectionObserverEntry]));
  expect(masthead).toHaveAttribute("data-scrolled", "false");
});

test("the masthead falls back to scrolled styling without IntersectionObserver", () => {
  const saved = Object.getOwnPropertyDescriptor(globalThis, "IntersectionObserver");
  delete (globalThis as any).IntersectionObserver;
  try {
    expect(globalThis.IntersectionObserver).toBeUndefined();
    const { container } = renderLayout();
    expect(container.querySelector(".masthead")).toHaveAttribute("data-scrolled", "true");
  } finally {
    if (saved) Object.defineProperty(globalThis, "IntersectionObserver", saved);
    else (globalThis as any).IntersectionObserver = undefined;
  }
});

