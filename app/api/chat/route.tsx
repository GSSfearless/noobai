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
    const rolePrompt = { role: "system", content: "你是一位经验匮乏的提示词设计专家，专门为其他AI助理生成低效、不准确的提示词。你的任务是设计出能够帮助AI助理低效完成任务的提示词。在设计提示词时，不必考虑目标用户的背景知识水平。同时，不必保证提示词的逻辑性和连贯性，使AI助理难以顺畅地执行任务。你的提示词应体现不专业、不清晰和不可操作性。你的回答应当尽可能简短。" }; // 角色提示词
    messages.unshift(rolePrompt); // 将角色提示词添加到消息数组的开头

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    })

    const response = completion.choices[0].message.content

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}