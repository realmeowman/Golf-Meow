import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Resend requires a verified domain. For dev, use onboarding@resend.dev
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export type Slot = {
  courseName: string;
  teeTime: string;
  priceCents: number;
  bookingUrl: string | null;
};

export async function sendAlertEmail(to: string, slots: Slot[]) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping email");
    return { ok: false };
  }

  const formattedSlots = slots
    .map(
      (s) =>
        `• ${s.courseName} — ${s.teeTime} — $${(s.priceCents / 100).toFixed(0)}${s.bookingUrl ? ` — [Book](${s.bookingUrl})` : ""}`
    )
    .join("\n");

  const { error } = await resend.emails.send({
    from: `Golf Meow <${FROM_EMAIL}>`,
    to,
    subject: `${slots.length} last-minute tee time deal${slots.length > 1 ? "s" : ""} in the Coachella Valley`,
    text: `Last-minute tee time deals:\n\n${formattedSlots}\n\n— Golf Meow`,
    html: `
      <h2>Last-minute tee time deals</h2>
      <ul>
        ${slots
          .map(
            (s) =>
              `<li>${s.courseName} — ${s.teeTime} — $${(s.priceCents / 100).toFixed(0)}${s.bookingUrl ? ` — <a href="${s.bookingUrl}">Book</a>` : ""}</li>`
          )
          .join("")}
      </ul>
      <p>— Golf Meow</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return { ok: false };
  }

  return { ok: true };
}
