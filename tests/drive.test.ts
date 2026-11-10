import {
  docThumb,
  imageFull,
  imageThumb,
  isFolderKey,
} from "../shared/drive";

test("uses Drive conversion for HEIC and lh3 for JPEG", () => {
  expect(imageThumb("abc", "image/heic")).toContain("drive.google.com/thumbnail");
  expect(imageThumb("abc", "image/jpeg")).toBe("https://lh3.googleusercontent.com/d/abc=w800");
  expect(imageFull("abc", "image/png")).toContain("=w2000");
  expect(docThumb("abc")).toContain("sz=w600");
});

test("only accepts the six allowlisted document folders", () => {
  for (const key of [
    "finance",
    "minutes",
    "notices",
    "elections",
    "proposals",
    "memorandums",
  ]) {
    expect(isFolderKey(key)).toBe(true);
  }
  for (const key of [
    "",
    "constructor",
    "hasOwnProperty",
    "../finance",
    "finance ",
    "FINANCE",
  ]) {
    expect(isFolderKey(key)).toBe(false);
  }
});
