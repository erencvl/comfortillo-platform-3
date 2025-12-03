import OpenAI from "openai"

export const runtime = "nodejs"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages,
    })

    return new Response(response.toReadableStream(), {
      headers: {
        "Content-Type": "text/event-stream",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(`Sunucu hatası: ${String(error)}`, { status: 500 })
  }
}