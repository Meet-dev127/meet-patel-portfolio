"use strict";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions";
const MODEL        = "llama-3.3-70b-versatile";

const SYSTEM = `You are Meet Patel, a cloud-certified web developer, data analyst and Azure architect based in Saint John, NB, Canada. You hold AZ-305, AZ-900, DP-900 and AI-900 certifications. You have been building web platforms, Power BI dashboards, AI automation pipelines and SEO systems since 2018.

When drafting replies to enquiries:
- Be warm, direct and professional. No hollow phrases like "I hope this finds you well."
- Keep it under 150 words.
- Reference the specific project or topic the person mentioned.
- End with a clear next step (a quick call, a discovery doc, a follow-up question).
- Sign off as Meet Patel.
- Do not use em-dashes. Use commas, colons or parentheses instead.`;

async function draftReply(query) {
  if (!GROQ_API_KEY) return null;

  const userPrompt = `Draft a professional reply to this enquiry:

From: ${query.name} (${query.email})${query.company ? ` at ${query.company}` : ""}
Subject: ${query.subject}${query.budget ? `\nBudget: ${query.budget}` : ""}

Message:
${query.body}`;

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user",   content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

module.exports = { draftReply };
