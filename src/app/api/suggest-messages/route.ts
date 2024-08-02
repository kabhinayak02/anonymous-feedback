import OpenAI, { OpenAIError } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

// Create an OpenAI API client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        // Extract the `prompt` from the body of the request
        // const { prompt } = await req.json();
        const prompt = ""

        // Ask OpenAI for a streaming completion given the prompt
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            max_tokens: 400,
            stream: true,
            prompt,
        });

        // Convert the response into a friendly text-stream
        const stream = OpenAIStream(response);

        // Respond with the stream
        return new StreamingTextResponse(stream);
    } catch (error) {
        if(error instanceof OpenAI.APIError){
            const {name, status, headers, message} = error
            return NextResponse.json(
                {
                    name, status, headers, message
                }, { status }
            )
        }
        else{
            console.error("An unexpeted error occuired", error)
            throw error
        }
    }
}