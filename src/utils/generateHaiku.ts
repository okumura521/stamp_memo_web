export async function generateHaiku(userInput: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const prompt = `
    次の内容をもとに、俳句を1つだけ詠んでください。
    - 五・七・五の形式で
    - 季語を含めてください
    - 解説や前置きは不要です
    - 俳句だけを1行で返してください

    内容：「${userInput}」
    `;

  const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{text: prompt}]
        }
      ]
    })
  }
);
  const data = await res.json();
  const haiku = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return haiku || "俳句の生成に失敗しました";
}