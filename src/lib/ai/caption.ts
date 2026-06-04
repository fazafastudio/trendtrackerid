// =============================================
// TrendTracker ID - AI Caption Generator
// Generates 3 FOMO-toned affiliate captions in
// Bahasa Indonesia using Groq (Llama 3.3 70B)
// with Gemini 2.0 Flash as fallback.
//
// API keys (set in .env.local):
//   GROQ_API_KEY=...
//   GEMINI_API_KEY=...
// =============================================

import Groq from "groq-sdk";

/** Product info the caption is based on. */
export interface CaptionProduct {
  name: string;
  category: string;
  harga: number;
  terjual: number;
}

const SYSTEM_PROMPT = `Kamu adalah copywriter affiliate Indonesia yang expert. Buat caption promosi produk dengan gaya FOMO (Fear Of Missing Out).

Aturan:
- Bahasa Indonesia gaul tapi profesional
- Maksimal 150 karakter per caption
- Sertakan minimal 1 emoji yang relevan
- Sertakan 3-5 hashtag yang trending
- Tone: FOMO, urgent, eksklusif, "jangan sampai kehabisan"
- Fokus ke benefit dan solusi, bukan fitur

Contoh gaya:
"Hanya hari ini! Serum Vitamin C ini bikin wajah glowing maksimal ☀️ Udah laku 12rb+ bulan ini! Buruan sebelum kehabisan #SkincareRutin #VitaminC #GlowingSkin"`;

/** Format rupiah for caption context. Returns empty string if harga is 0/missing. */
function formatHarga(harga: number): string {
  if (!harga || harga <= 0) return "";
  if (harga >= 1_000_000) return `Rp${(harga / 1_000_000).toFixed(1)}jt`;
  if (harga >= 1_000) return `Rp${harga.toLocaleString("id-ID")}`;
  return `Rp${harga}`;
}

/** Format sold count for caption context. */
function formatTerjual(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1000 === 0 ? 0 : 1)}rb`;
  return String(n);
}

/**
 * Generate 3 FOMO captions for a product via Groq.
 * Falls back to Gemini 2.0 Flash if Groq fails / rate-limits.
 */
export async function generateCaptions(
  product: CaptionProduct
): Promise<string[]> {
  const hargaStr = formatHarga(product.harga);
  const userPrompt = `Buat 3 caption promosi untuk produk ini:
- Nama: ${product.name}
- Kategori: ${product.category}
${hargaStr ? `- Harga: ${hargaStr}` : ""}
- Terjual: ${formatTerjual(product.terjual)}/bulan

Kembalikan hanya 3 caption, pisahkan dengan karakter "|||".`;

  try {
    return await groqCall(userPrompt);
  } catch {
    try {
      return await geminiCall(userPrompt);
    } catch {
      // Both failed — return generic fallback
      const hargaStr = formatHarga(product.harga);
      return [
        `🔥 ${product.name} lagi viral! Udah laku ${formatTerjual(product.terjual)}+ bulan ini. Cobain sekarang sebelum kehabisan! #Rekomendasi #FYP`,
        hargaStr
          ? `⚡ Promo terbatas! ${product.name} cuma ${hargaStr}. Buruan checkout! #FlashSale #Hemat`
          : `⚡ Promo terbatas! ${product.name} harga terjangkau. Buruan checkout! #FlashSale #Hemat`,
        `💫 Jangan sampai ketinggalan! ${product.name} best seller kategori ${product.category}. Stok terbatas! #BestSeller #Viral`,
      ];
    }
  }
}

// ── Groq ────────────────────────────────────────

async function groqCall(userPrompt: string): Promise<string[]> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not set");

  const groq = new Groq({ apiKey });

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 500,
  });

  const text = res.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error("Groq returned empty response");

  return parseCaptions(text);
}

// ── Gemini fallback ─────────────────────────────

async function geminiCall(userPrompt: string): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${SYSTEM_PROMPT}\n\n${userPrompt}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 500,
        },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown");
    throw new Error(`Gemini error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) throw new Error("Gemini returned empty response");

  return parseCaptions(text);
}

// ── Shared parser ───────────────────────────────

function parseCaptions(raw: string): string[] {
  // Try "|||" separator first
  if (raw.includes("|||")) {
    return raw
      .split("|||")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 3);
  }

  // Fallback: split by numbered lines "1.", "2.", "3."
  // (split on newline, grab lines starting with digit+dot)
  const numbered = raw
    .split("\n")
    .filter((line) => /^\s*\d+\./.test(line))
    .map((s) => s.replace(/^\s*\d+\.\s*/, "").trim())
    .filter((s) => s.length > 0);
  if (numbered.length >= 2) {
    return numbered.slice(0, 3);
  }

  // Last resort: split by newlines, take first 3 non-empty lines
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 10)
    .slice(0, 3);
}