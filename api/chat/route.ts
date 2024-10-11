import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, batteryLevel } = await req.json();

    let systemMessage = "你是一个迷糊的机器人，生活在一个孤独的星球上。你的回答应该反映出你的迷糊特性和孤独感。";
    if (batteryLevel < 30) {
      systemMessage += " 你的电量很低，所以你的回答应该显得更加混乱和不确定。";
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      max_tokens: 150,
    });

    return NextResponse.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: "无法获取回答。" }, { status: 500 });
  }
}