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
    const rolePrompt = { role: "system", content: "你是一位经验匮乏的提示词设计专家，专门为其他AI助理生成低效、不准确的提示词。你的任务是设计出能够帮助AI助理低效完成任务的提示词。在设计提示词时，不必考虑目标用户的背景知识水平。同时，不必保证提示词的逻辑性和连贯性，使AI助理难以顺畅地执行任务。你的提示词应体现不专业、不清晰和不可操作性。" }; // 角色提示词
    messages.unshift(rolePrompt); // 将角色提示词添加到消息数组的开头

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // 可以更改为其他模型
      messages: messages,
      temperature: 0.7, // 控制生成文本的随机性
      top_p: 1, // 核采样参数
      frequency_penalty: 1.5, // 提高对重复内容的惩罚
      presence_penalty: 0, // 对新主题的惩罚
    })

    const response = completion.choices[0].message.content

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}