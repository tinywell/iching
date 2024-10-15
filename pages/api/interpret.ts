import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { query, hexagramInfo, interpretation, interpretationReason } = req.body;
    const prompt = `
    用户占卜的问题: ${query}
    卦象: ${hexagramInfo.name} (${hexagramInfo.fu})
    解读方式为: ${interpretationReason}
    解卦卦辞: ${typeof interpretation.content === 'string' ? interpretation.content : JSON.stringify(interpretation.content)}
    `;
    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {role: "system", content: "You are an I Ching expert. Interpret the hexagram and provide insights based on the user's query."},
          {role: "user", content: prompt}
        ],
        stream: true,
      });

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        res.write(`data: ${content}\n\n`);
      }

      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error) {
      console.error('Error getting AI interpretation:', error);
      res.status(500).json({ error: 'Error getting AI interpretation' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
