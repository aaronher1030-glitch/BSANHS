import type { Activity } from "./types";

const driveFile = (id: string) => `https://drive.google.com/file/d/${id}/view`;

/**
 * The activity record mirrors the school's public accomplishments page: the
 * same eight activities, in that order, each with the poster published there.
 * The separate photo gallery lives inside each activity's Drive album.
 */
export const ACTIVITIES = [
  {
    slug: "world-teachers-day-2026",
    title: "World Teachers' Day 2026",
    caption:
      "To honor the dedication and service of teachers, this celebration recognized their contributions to learners and the school community through a programme led by the SSLG and LGCC.",
    cover: {
      kind: "image",
      src: "/media/teachers-day-2026.webp",
      alt: "Teachers' Day and Foundation Day celebration poster",
    },
    album: "1yVIUPC5q0G8EsRahOUxbHG_EvSByCXlz",
    reportUrl: driveFile("1KiYs31znp_3EKYMNV0hxJCQvcK90mtws"),
  },
  {
    slug: "inkantations-2026",
    title: "INKantations: Melodramatic Essay Writing Contest",
    caption:
      "To celebrate the power of the written word, the SSLG invites learners to pen dramatically tragic, wildly theatrical essays in this spooky-season showcase of creativity and flair.",
    cover: {
      kind: "image",
      src: "/media/inkantations-2026.webp",
      alt: "INKantations poster: Melodramatic Essay Writing Contest",
    },
    featured: true,
  },
  {
    slug: "lgcc-clean-up-2026",
    title: "LGCC Clean-Up Drive – Project ECOLEAD",
    caption:
      "To promote environmental stewardship and maintain a clean learning environment, the LGCC and SSLG led a school-wide clean-up drive under Project ECOLEAD.",
    cover: {
      kind: "image",
      src: "/media/lgcc-clean-up-2026.webp",
      alt: "LGCC Clean-Up Drive poster",
    },
    album: "1_0DykrJF1DVEzwo19m9mbgAp2HRi85ix",
    reportUrl: driveFile("10EnbVjEL94AXwWm4IeW5QRCi29Z9tJy5"),
  },
  {
    slug: "earthquake-drill-2026",
    title: "National Simultaneous Earthquake Drill 2026",
    caption:
      "To strengthen disaster preparedness and safety awareness, SSLG officers and Red Cross Youth members joined the 2026 National Simultaneous Earthquake Drill.",
    cover: {
      kind: "image",
      src: "/media/earthquake-drill-2026.webp",
      alt: "National Simultaneous Earthquake Drill 2026 poster",
    },
    album: "1UT4M9b8TrctZ-d-tGjAEPbLADbUo_ik8",
  },
  {
    slug: "project-tinig",
    title: "Project Tinig",
    caption:
      "To strengthen transparency, accountability, and student participation by establishing an online platform where students can access SSLG reports, announcements, financial summaries, and submit feedback or concerns, ensuring that every voice is heard.",
    cover: {
      kind: "image",
      src: "/media/project-tinig.webp",
      alt: "Project Tinig poster",
    },
  },
  {
    slug: "induction-ceremony-2026",
    title: "Onto the Next Leaders Induction Ceremony",
    caption:
      "To instill a sense of responsibility, leadership, and commitment among the officers, this event formally introduced and recognized the newly elected student leaders.",
    cover: {
      kind: "image",
      src: "/media/induction-2026.webp",
      alt: "Onto the Next Leaders Induction Ceremony 2026 invitation",
    },
    album: "1iPxMcxI61C0pIZDc_2raj4IYfZAyxLL_",
    reportUrl: driveFile("1omiyOdHtxgngsb7WMcpNGTaZsaMBgrYE"),
  },
  {
    slug: "grade-7-representatives-election-2026",
    title: "Grade 7 Representatives Election for the S.Y 2026-2027",
    caption:
      "To promote student leadership, this project facilitated the election of Grade 7 Representatives who now serve as the official spokespeople of their year level within the Supreme Secondary Learner Government (SSLG).",
    cover: {
      kind: "image",
      src: "/media/grade-7-election-2026.webp",
      alt: "Grade 7 Representatives Election 2026 poster",
    },
    album: "1y2tKu7-5uoxBK-jQ2dN0sEIqCj2tL8av",
    reportUrl: driveFile("168M9PVEHlju8RL0DRNUwljBU9BPS0pGa"),
  },
  {
    slug: "club-organizations-membership-drive-2026",
    title: "Club and Organizations Membership Drive",
    caption:
      "To foster enhanced student engagement and dedication, this project helped the students pick what fits their interests and goals that will also help them feel more involved in their community.",
    cover: {
      kind: "image",
      src: "/media/club-membership-drive-2026.webp",
      alt: "Clubs and Organizations Membership Drive 2026 poster",
    },
    album: "1S6yMnWlYO_ilgiwc5akv32WAOYmI3rtf",
    reportUrl: driveFile("1ZRyWYuL4w1oZcgo0V5HU-vr0JMq6g-4Y"),
  },
] satisfies Activity[];
