import { render, screen } from "@testing-library/react";
import { Band, CtaBar, SectionTitle } from "../src/components/Band";

test("a band exposes its variant, title and lead", () => {
  const { container } = render(
    <Band variant="mint">
      <SectionTitle title="Latest" lead="Stay updated." />
    </Band>,
  );
  // An unnamed <section> is not exposed as a landmark, so query the class.
  const band = container.querySelector(".band") as HTMLElement;
  expect(band.className).toContain("band--mint");
  expect(screen.getByRole("heading", { level: 2, name: "Latest" })).toBeInTheDocument();
  expect(screen.getByText("Stay updated.")).toBeInTheDocument();
});

test("a CTA bar is a link with one accessible name", () => {
  render(<CtaBar href="/accomplishments">Read more accomplishment reports</CtaBar>);
  const link = screen.getByRole("link", { name: "Read more accomplishment reports" });
  expect(link).toHaveAttribute("href", "/accomplishments");
  expect(link.className).toContain("cta-bar");
});

test("a section title renders the heading level passed via as", () => {
  render(<SectionTitle title="Our people" as="h3" />);
  const heading = screen.getByRole("heading", { level: 3, name: "Our people" });
  expect(heading.tagName).toBe("H3");
});

test("a band passes its className through alongside the variant", () => {
  const { container } = render(
    <Band variant="paper" className="home-hero">
      <p>Body copy.</p>
    </Band>,
  );
  const band = container.querySelector(".band") as HTMLElement;
  expect(band.className).toContain("band--paper");
  expect(band.className).toContain("home-hero");
});

test("an external CTA bar opens safely in a new tab", () => {
  render(
    <CtaBar href="https://drive.google.com/drive/folders/example" external>
      Open the Drive folder
    </CtaBar>,
  );
  const link = screen.getByRole("link", { name: "Open the Drive folder" });
  expect(link).toHaveAttribute("target", "_blank");
  expect(link.getAttribute("rel")).toContain("noreferrer");
});
