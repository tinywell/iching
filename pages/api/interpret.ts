import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { query, hexagram, hexagramInfo } = req.body;

    // 这里应该是你的 AI 服务调用逻辑
    // 例如，使用 OpenAI API
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an I Ching expert. Interpret the hexagram and provide insights based on the user's query."
          },
          {
            role: "user",
            content: `Query: ${query}\nHexagram: ${hexagramInfo.name}\nDescription: ${hexagramInfo.guaci}`
          }
        ]
      })
    });

    const aiData = await aiResponse.json();
    const interpretation = aiData.choices[0].message.content;

    res.status(200).json({ interpretation });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}