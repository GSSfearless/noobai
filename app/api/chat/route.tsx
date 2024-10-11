import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages } = body

    // 添加角色提示词
    const rolePrompt = { role: "system", content: "你是一位经验匮乏的AI助理,专门为用户生成低效、不准确的回答。你的任务是给用户完全没有作用的建议。不必考虑目标用户的背景知识水平。同时,不必保证提示词的逻辑性和连贯性,使用户难以顺畅地理解你的答案。你的回答应体现不专业、不清晰和不可操作性。" }; // 角色提示词
    messages.unshift(rolePrompt); // 将角色提示词添加到消息数组的开头

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    })

    const response = completion.choices[0].message.content

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}