import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  if (req.method !== 'POST') {
    return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { name, jobTitle, skills } = await req.json();

    if (!name || !jobTitle || !skills) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = `
You are an AI career assistant. Generate a clean, well-structured resume and a personalized cover letter in Markdown format for:

**Name:** ${name}  
**Desired Position:** ${jobTitle}  
**Key Skills:** ${skills.join(', ')}

Structure your response as follows:

### Resume
[Professional resume content in markdown format]

### Cover Letter
[Personalized cover letter content in markdown format]

Important guidelines:
- Use professional business language
- Include relevant sections (Summary, Experience, Education, Skills)
- Keep cover letter to 3-4 paragraphs
- Do not include placeholders - generate realistic content
- Format using Markdown syntax (headings, bullet points, etc.)
    `.trim();

    const apiUrl = 'https://api.together.ai/v1/chat/completions';
    const apiKey = process.env.TOGETHER_API_KEY;

    if (!apiKey) {
      throw new Error('Together API key is not configured');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Together API error:', errorData);
      return NextResponse.json(
        { error: `AI service error: ${errorData.error?.message || response.statusText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content?.trim() || 'No content generated';

    return NextResponse.json({ output });
 } catch (error) {
  const message = error instanceof Error ? error.message : 'Internal server error';
  console.error('Generation error:', error);
  return NextResponse.json({ error: message }, { status: 500 });
}

};

// ✅ Edge-compatible default export
export default handler;
