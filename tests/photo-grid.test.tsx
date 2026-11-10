import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { AlbumViewer } from "../src/components/AlbumViewer";
import { PhotoGrid } from "../src/components/PhotoGrid";

const photos = [
  { id: "1", name: "IMG_0012.JPG", mime: "image/jpeg", thumb: "/a.jpg", full: "/b.jpg" },
  { id: "2", name: "IMG_0013.JPG", mime: "image/jpeg", thumb: "/c.jpg", full: "/d.jpg" },
];

test("opens the lightbox, steps, and restores focus on Escape", () => {
  render(<PhotoGrid photos={photos} />);
  const trigger = screen.getByRole("button", { name: /IMG 0012/i });
  trigger.focus();
  fireEvent.click(trigger);
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByText("1 / 2")).toBeInTheDocument();
  fireEvent.keyDown(document, { key: "ArrowRight" });
  expect(screen.getByText("2 / 2")).toBeInTheDocument();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(document.activeElement).toBe(trigger);
});

test("the lightbox cycles focus between close, previous and next", () => {
  render(<PhotoGrid photos={photos} />);
  fireEvent.click(screen.getByRole("button", { name: /IMG 0012/i }));

  const close = screen.getByRole("button", { name: /Close photo viewer/i });
  const prev = screen.getByRole("button", { name: /Previous photo/i });
  const next = screen.getByRole("button", { name: /Next photo/i });
  // Opening focuses the close control.
  expect(document.activeElement).toBe(close);

  next.focus();
  fireEvent.keyDown(document, { key: "Tab" });
  expect(document.activeElement).toBe(close);

  fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
  expect(document.activeElement).toBe(next);

  prev.focus();
  fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
  expect(document.activeElement).toBe(close);
});

test("Escape inside the lightbox closes only the lightbox, not the album panel", () => {
  const onClose = vi.fn();

  render(
    <AlbumViewer albumId="nestedAlbum0000000000000" name="Nested album" photos={photos} onClose={onClose} focusOnMount />,
  );

  const trigger = screen.getByRole("button", { name: /IMG 0012/i });
  const panel = screen.getByRole("region", { name: /Nested album album/i });
  trigger.focus();
  fireEvent.click(trigger);
  expect(screen.getByRole("dialog")).toBeInTheDocument();

  // Dispatch on the focused control INSIDE the panel so the event bubbles
  // through the panel's own Escape handler — the path that double-closed both
  // layers before the capture-phase guard.
  const close = screen.getByRole("button", { name: /Close photo viewer/i });
  expect(document.activeElement).toBe(close);
  fireEvent.keyDown(close, { key: "Escape" });

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(panel).toBeInTheDocument();
  expect(onClose).not.toHaveBeenCalled();
  expect(document.activeElement).toBe(trigger);
});

test("an inline album leaves focus and Escape alone", () => {
  // AlbumViewer also mounts as page content (an activity detail), where its
  // onClose navigates back to the index. Focusing the panel then would steal
  // focus on load, and a page-wide Escape would turn any dismiss gesture into
  // a navigation — including closing the mobile menu.
  const onClose = vi.fn();

  render(<AlbumViewer albumId="inlineAlbum00000000000" name="Inline album" photos={[]} onClose={onClose} />);

  const close = screen.getByRole("button", { name: "Close" });
  expect(document.activeElement).not.toBe(close);
  expect(screen.getByText("This album has no photos yet.")).toBeInTheDocument();
  expect(document.activeElement).not.toBe(close);

  // focusOnMount defaults to false here, so Escape is not a close gesture —
  // not even from the panel's own Close button, which is focusable inline.
  fireEvent.keyDown(document.body, { key: "Escape" });
  expect(onClose).not.toHaveBeenCalled();
  close.focus();
  fireEvent.keyDown(close, { key: "Escape" });
  expect(onClose).not.toHaveBeenCalled();
});

test("focusOnMount moves focus to the panel Close and scopes Escape to it", () => {
  const onClose = vi.fn();

  render(
    <AlbumViewer albumId="disclosureAlbum0000000" name="Disclosure album" photos={[]} onClose={onClose} focusOnMount />,
  );
  expect(screen.getByText("This album has no photos yet.")).toBeInTheDocument();
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close" }));

  // Escape closes only while focus is inside the panel: a stacked menu owns
  // the key when focus has moved there.
  (document.activeElement as HTMLElement).blur();
  fireEvent.keyDown(document.body, { key: "Escape" });
  expect(onClose).not.toHaveBeenCalled();

  screen.getByRole("button", { name: "Close" }).focus();
  fireEvent.keyDown(document.body, { key: "Escape" });
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("an empty album says so and still links to its Drive folder", () => {
  render(
    <AlbumViewer albumId="emptyAlbum00000000000000" name="Empty album" photos={[]} onClose={() => {}} />,
  );

  expect(screen.getByText("This album has no photos yet.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Open in Drive/i })).toHaveAttribute(
    "href",
    "https://drive.google.com/drive/folders/emptyAlbum00000000000000",
  );
});
