import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

const jsonHeaders = {
  ...corsHeaders,
  "Content-Type": "application/json",
};

const escapeHtml = (value = "") =>
  value
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const tableRow = (label, value) =>
  `<tr>
    <td style="padding:6px 12px;font-weight:600;">${escapeHtml(label)}</td>
    <td style="padding:6px 12px;color:#1f2937;">${escapeHtml(value)}</td>
  </tr>`;

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const contentType = event.headers["content-type"] ?? event.headers["Content-Type"] ?? "";
  let payload = {};

  try {
    if (contentType.includes("application/json")) {
      payload = JSON.parse(event.body ?? "{}");
    } else {
      const params = new URLSearchParams(event.body ?? "");
      payload = Object.fromEntries(params.entries());
    }
  } catch (parseError) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  const { firstName, lastName, email, company = "", revenue = "", message = "" } = payload;

  if (!firstName || !lastName || !email) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "Missing required fields" }),
    };
  }

  if (!process.env.RESEND_API_KEY) {
    return {
      statusCode: 500,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "Email service is not configured" }),
    };
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const submittedAt = new Date().toISOString();

  const html = `
    <main style="max-width:640px;margin:0 auto;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#111827;">
      <h2 style="font-size:20px;margin-bottom:12px;">New contact form submission</h2>
      <p style="margin-bottom:16px;color:#4b5563;">Submitted at ${escapeHtml(submittedAt)}</p>
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:12px;overflow:hidden;">
        <tbody>
          ${tableRow("Name", fullName)}
          ${tableRow("Email", email)}
          ${tableRow("Company", company || "—")}
          ${tableRow("Revenue", revenue || "—")}
          ${tableRow("Message", message || "—")}
        </tbody>
      </table>
    </main>
  `;

  const text = `New contact form submission

Name: ${fullName}
Email: ${email}
Company: ${company || "—"}
Revenue: ${revenue || "—"}

Message:
${message || "—"}
`;

  try {
    await resend.emails.send({
      from: "Xceltax Contact <contact@mail.xceltax.com>",
      to: ["masood@xceltax.com"],
      subject: `New contact form submission from ${fullName}`,
      html,
      text,
    });
  } catch (error) {
    console.error("Resend error", error);
    return {
      statusCode: 502,
      headers: jsonHeaders,
      body: JSON.stringify({
        error: "Failed to send email",
        details: error?.message ?? "Unknown error",
      }),
    };
  }

  return {
    statusCode: 200,
    headers: jsonHeaders,
    body: JSON.stringify({ success: true }),
  };
};
