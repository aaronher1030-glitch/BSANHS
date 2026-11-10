import { ACTIVITIES } from "../src/content/activities";
import { DOCUMENT_GROUPS } from "../src/content/documents";
import { FINANCE_REPORT, FINANCE_STATS } from "../src/content/finance";
import { OFFICERS } from "../src/content/officers";
import { ABOUT_INTRO, DUTIES, GPOA, LEGAL_BASES, MANDATE, OBJECTIVES } from "../src/content/site";
import { ACCOMPLISHMENT_REPORTS_URL, RECORDS_ROOT_URL } from "../src/config";

test("slugs are unique and every activity has copy", () => {
  const slugs = ACTIVITIES.map((a) => a.slug);
  expect(new Set(slugs).size).toBe(slugs.length);
  for (const a of ACTIVITIES) {
    expect(a.title.length).toBeGreaterThan(3);
    expect(a.caption.length).toBeGreaterThan(30);
    expect(a.caption).not.toMatch(/=formally|who now serves/);
  }
});

test("image covers point at a shipped webp under /media", () => {
  // One shipped poster per activity published on the school's public
  // accomplishments page, so the index matches that page image-for-image.
  expect(ACTIVITIES.filter((a) => a.cover.kind === "image").map((a) => a.slug)).toEqual([
    "world-teachers-day-2026",
    "inkantations-2026",
    "lgcc-clean-up-2026",
    "earthquake-drill-2026",
    "project-tinig",
    "induction-ceremony-2026",
    "grade-7-representatives-election-2026",
    "club-organizations-membership-drive-2026",
  ]);
  for (const a of ACTIVITIES.filter((x) => x.cover.kind === "image")) {
    expect(a.cover.kind === "image" && a.cover.src).toMatch(/^\/media\/[a-z0-9-]+\.webp$/);
  }
});

// Vite resolves this glob against the real filesystem, so it proves the
// portraits exist on disk. (The project ships no @types/node, so node:fs
// cannot be used here without adding a dependency.)
const portraitsOnDisk = Object.keys(import.meta.glob("/public/brand/officers/*.webp"));

test("every officer has a published name, role and portrait path", () => {
  expect(OFFICERS.length).toBe(27);
  for (const o of OFFICERS) {
    expect(o.name.trim().length).toBeGreaterThan(0);
    expect(o.role.trim().length).toBeGreaterThan(0);
    expect(o.photo).toMatch(/^\/brand\/officers\/[a-z0-9-]+\.webp$/);
  }
  expect(new Set(OFFICERS.map((o) => o.photo)).size).toBe(27);
});

// The public source repository omits the school-owned portraits. In the
// deployment checkout they are present, and then every officer must have one.
test.skipIf(portraitsOnDisk.length === 0)("ships a portrait file for every officer", () => {
  for (const o of OFFICERS) {
    expect(portraitsOnDisk).toContain(`/public${o.photo}`);
  }
  expect(portraitsOnDisk).toHaveLength(27);
});

test("keeps the published activity and officer inventory", () => {
  // The index mirrors the school's public accomplishments page deck-for-deck.
  expect(ACTIVITIES).toHaveLength(8);
  expect(ACTIVITIES.every((a) => a.cover.kind === "image")).toBe(true);
  expect(ACTIVITIES.filter((a) => a.featured).map((a) => a.slug)).toEqual(["inkantations-2026"]);

  const induction = ACTIVITIES.find((a) => a.slug === "induction-ceremony-2026");
  expect(induction?.cover).toEqual({
    kind: "image",
    src: "/media/induction-2026.webp",
    alt: "Onto the Next Leaders Induction Ceremony 2026 invitation",
  });
  expect(induction?.album).toBe("1iPxMcxI61C0pIZDc_2raj4IYfZAyxLL_");
  expect(induction?.reportUrl).toMatch(/^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]{20,}\/view$/);

  const tinig = ACTIVITIES.find((a) => a.slug === "project-tinig");
  expect(tinig?.cover).toEqual({
    kind: "image",
    src: "/media/project-tinig.webp",
    alt: "Project Tinig poster",
  });
  expect(tinig?.album).toBeUndefined();
  expect(tinig?.reportUrl).toBeUndefined();
  for (const a of ACTIVITIES.filter((x) => x.reportUrl)) {
    expect(a.reportUrl).toMatch(/^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]{20,}\/view$/);
  }

  expect(new Set(OFFICERS.map((o) => o.name)).size).toBe(27);
  expect(OFFICERS[0]).toMatchObject({
    name: "Hon. Rhian Jade L. Castro",
    role: "SSLG President",
    group: "executive",
    photo: "/brand/officers/rhian-jade-l-castro.webp",
  });
  const groups = OFFICERS.reduce<Record<string, number>>((count, o) => {
    count[o.group] = (count[o.group] ?? 0) + 1;
    return count;
  }, {});
  expect(groups).toEqual({ executive: 7, grade: 12, school: 8 });
});

test("carries the published finance figures", () => {
  expect(FINANCE_STATS.map((s) => s.value)).toEqual(["₱13,327.90", "26", "10"]);
  expect(FINANCE_STATS.map((s) => s.label)).toEqual([
    "Current Funds", "Proposed PPAs", "Projects accomplished",
  ]);
  // Pinned verbatim: the notes are published captions, and the projects date
  // shipped a day early once (July 26 instead of the published July 28).
  expect(FINANCE_STATS.map((s) => s.note)).toEqual([
    "as of November 8, 2026",
    "from the SSLG GPOA (up for approval)",
    "as of July 28, 2026",
  ]);
  expect(FINANCE_REPORT.title).toBe("SSLG Financial Report");
  expect(FINANCE_REPORT.date).toBe("November 8, 2026");
  expect(FINANCE_REPORT.preparedBy).toBe("Samantha C. De Venecia");
  expect(FINANCE_REPORT.preparedRole).toBe("SSLG Treasurer");
  expect(FINANCE_REPORT.folderUrl).toBe(
    "https://drive.google.com/drive/folders/1NhgG1fkfxch70E3hzb5YhTgCK0PWKcdV",
  );
});

test("keeps the published document groups and About copy", () => {
  expect(DOCUMENT_GROUPS.map((g) => g.key)).toEqual([
    "minutes", "notices", "elections", "proposals", "memorandums", "finance",
  ]);
  expect(
    DOCUMENT_GROUPS.every((g) => g.folderUrl.startsWith("https://drive.google.com/drive/folders/")),
  ).toBe(true);
  expect(DOCUMENT_GROUPS.map((g) => g.folderUrl)).toEqual([
    "https://drive.google.com/drive/folders/1qm3Z6OmjxFa41OsjTPrBUJEl57-GSGH5",
    "https://drive.google.com/drive/folders/1SVzssvcj1IkEndY0Mp5Nv8WhDsaQUDl4",
    "https://drive.google.com/drive/folders/1hiqv7sFda_cGWVo7OtgJs5cpPS-buZ4L",
    "https://drive.google.com/drive/folders/15vGFBRfifPvEUkN5yo1iv87MQPAoaFHE",
    "https://drive.google.com/drive/folders/1xszCcvP83aaVus3xLQ4f1RDmjvWqLHUj",
    "https://drive.google.com/drive/folders/1NhgG1fkfxch70E3hzb5YhTgCK0PWKcdV",
  ]);
  expect(OBJECTIVES).toHaveLength(5);
  expect(DUTIES).toHaveLength(3);
  expect(MANDATE).toBe("The SSLG shall be the highest student governing body in the school, be the forefront of learners' rights and welfare; model of learners' excellence; and representation of good character and deep sense of good moral values.");
});

test("carries the About intro, legal basis and GPOA copy", () => {
  expect(ABOUT_INTRO).toBe(
    "The highest student governing body of Benigno S. Aquino National High School. Forefront of learners' rights and welfare, model of learners' excellence, and representation of good character and deep sense of moral values.",
  );
  expect(LEGAL_BASES.heading).toBe("Legal bases of the Supreme Secondary Learner Government");
  expect(LEGAL_BASES.issuance).toBe("OUOPS No. 2023-03-Memorandum");
  expect(LEGAL_BASES.title).toBe(
    "Interim Guidelines of the Learner Government Program (LGP) for School Year 2023–2024",
  );
  expect(LEGAL_BASES.url).toContain("1MthdcNxs_w_QoLuus-nVcAoi4xaACNKd");
  expect(GPOA.title).toBe("General Plan of Action");
  expect(GPOA.folderUrl).toBe("https://drive.google.com/drive/folders/16_T5tmGrzwHF6X9lR1JxrNY8K1C9EYnN");
});

test("exposes the published Drive vault URLs", () => {
  expect(ACCOMPLISHMENT_REPORTS_URL).toBe(
    "https://drive.google.com/drive/folders/1_44iCUzUJAaBi0cc0a7DcpauUPpRJIxj",
  );
  expect(RECORDS_ROOT_URL).toBe(
    "https://drive.google.com/drive/folders/1XU9s-pHPCk_zJQo7LSOjcmtGeIiI9JeM",
  );
});
