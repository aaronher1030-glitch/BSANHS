import type { Officer } from "./types";

const photo = (name: string) =>
  `/brand/officers/${name
    .replace(/^Hon\.\s*/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}.webp`;

const roster = [
  { name: "Hon. Rhian Jade L. Castro", role: "SSLG President", group: "executive" },
  { name: "Hon. Aaron Y. Hernandez", role: "SSLG Vice President", group: "executive" },
  { name: "Hon. Micaella Sabelle R. Monloy", role: "SSLG Secretary", group: "executive" },
  { name: "Hon. Sophia Elise C. Aguas", role: "SSLG Public Information Officer", group: "executive" },
  { name: "Hon. Samantha Joy C. De Venecia", role: "SSLG Treasurer", group: "executive" },
  { name: "Hon. Diyah Marowe T. Hipolito", role: "SSLG Auditor", group: "executive" },
  { name: "Hon. Ian Kendrick M. Lapuz", role: "SSLG Protocol Officer", group: "executive" },
  { name: "Hon. Rajon Landolf F. Lobo", role: "SSLG Grade 12 Chairperson", group: "grade" },
  { name: "Hon. Yuan B. Cutiongco", role: "SSLG Grade 12 Representative", group: "grade" },
  { name: "Hon. Blu Enno U. Sampang", role: "SSLG Grade 11 Chairperson", group: "grade" },
  { name: "Hon. Godswill Jobel D. Noe", role: "SSLG Grade 11 Representative", group: "grade" },
  { name: "Hon. Akio Nathan C. Manlapaz", role: "SSLG Grade 10 Chairperson", group: "grade" },
  { name: "Hon. Rommel S. Dizon, Jr.", role: "SSLG Grade 10 Representative", group: "grade" },
  { name: "Hon. Vince Yael P. Garin", role: "SSLG Grade 9 Chairperson", group: "grade" },
  { name: "Hon. Juliana Bea Q. De Guzman", role: "SSLG Grade 9 Representative", group: "grade" },
  { name: "Hon. Josh Edan D. Porlucas", role: "SSLG Grade 8 Chairperson", group: "grade" },
  { name: "Hon. Zyrene Gale W. Tinio", role: "SSLG Grade 8 Representative", group: "grade" },
  { name: "Hon. Chloe Danielle L. David", role: "SSLG Grade 7 Chairperson", group: "grade" },
  { name: "Hon. Kean Albert J. Pineda", role: "SSLG Grade 7 Representative", group: "grade" },
  { name: "Dr. Amparo M. Munoz", role: "Principal IV", group: "school" },
  { name: "Hon. Gilbert Policarpio", role: "Head Teacher VI", group: "school" },
  { name: "Hon. Aaron Khristian Banag", role: "SSLG Adviser", group: "school" },
  { name: "Hon. Christopher Kabilangan", role: "SSLG Co-Adviser", group: "school" },
  { name: "Hon. Jayvee Zarate", role: "SSLG Co-Adviser", group: "school" },
  { name: "Hon. Mary Joy Santos", role: "SSLG Co-Adviser", group: "school" },
  { name: "Hon. Ma Theresa Gatchalian", role: "SSLG Co-Adviser", group: "school" },
  { name: "Hon. Mira Narciso", role: "SSLG Co-Adviser", group: "school" },
] satisfies Omit<Officer, "photo">[];

export const OFFICERS: Officer[] = roster.map((officer) => ({
  ...officer,
  photo: photo(officer.name),
}));
