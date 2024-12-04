import { streamText, tool, ToolInvocation } from 'ai';
import * as mathjs from 'mathjs';
import { openai } from '@ai-sdk/openai';
import puppeteer from 'puppeteer';
import { z } from 'zod';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolInvocation[];
}
export const maxDuration = 30;


// Browser automation tool definition
const browserTool = tool({
  description: 'A tool for automating web browser actions',
  parameters: z.object({
    url: z.string().describe("The URL to navigate to"),
    action: z.object({
      type: z.enum([
        'click', 'type', 'getText', 'screenshot', 'navigate']).describe("The type of action to perform, click on an element, type text into an input field, get the text content of an element, take a screenshot of the current page, or navigate to a URL"),
      selector: z.string().optional().describe("The selector of the element to interact with"),
      text: z.string().optional().describe("The text to type into an input field")
    })
  }),
  execute: async ({ url, action }) => {
    console.log('Executing browser actions:', action);
    const browser = await puppeteer.launch({ headless: true , ignoreDefaultArgs: ['--disable-extensions']});
    try {
      const page = await browser.newPage();
      await page.goto(url);
      const results = [];
      switch (action.type) {
        case 'click':
            await page.click(action.selector!);
            results.push({ type: 'click', status: 'success' });
            break;
          case 'type':
            await page.type(action.selector!, action.text!);
            results.push({ type: 'type', status: 'success' });
            break;
          case 'getText':
            const text = await page.$eval(action.selector!, (el) => el.textContent);
            results.push({ type: 'text', data: text });
            break;
          case 'screenshot':
            const screenshot = await page.screenshot({ encoding: 'base64' });
            results.push({ type: 'screenshot', data: screenshot });
            break;
          case 'navigate':
            if (!action.text) throw new Error('URL is required for navigation');
            await page.goto(action.text);
            results.push({ type: 'navigate', status: 'success' });
            break;
      }
      return results;
    } catch (error) {
      console.error('Browser action error:', error);
      if (error instanceof Error) {
        return [{ type: 'error', status: 'failed', message: error.message }];
      }
      return [{ type: 'error', status: 'failed', message: 'Unknown error occurred' }];
    } finally {
      await browser.close();
    }
  }
});

export async function POST(request: Request) {
  try {
    const { messages }: { messages: Message[] } = await request.json();

    const result = streamText({
      model: openai('gpt-4o'),
      tools: {
        calculate: tool({
          description:
            'A tool for evaluating mathematical expressions. ' +
            'Example expressions: ' +
            "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
          parameters: z.object({ expression: z.string() }),
          execute: async ({ expression }) => mathjs.evaluate(expression),
        }),
        browser: browserTool
      },
    //   maxSteps: 10,
      messages: messages,
      system:
        'You are an AI assistant capable of mathematical calculations and web browsing. ' +
        'You can use the calculator for math problems and the browser for web interactions. ' +
        'Always explain your reasoning step by step.',
    //   prompt: messages[messages.length - 1].content,
    });
    return result.toDataStreamResponse()

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
