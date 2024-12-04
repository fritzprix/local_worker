import { NextResponse } from 'next/server';
import puppeteer, { Page } from 'puppeteer';

// Add these types at the top of the file, after the imports
interface BrowserAction {
  type: 'click' | 'type' | 'screenshot' | 'getText';
  selector?: string;
  text?: string;
}

interface ActionResult {
  type: 'screenshot' | 'text';
  data: Buffer | string;
}

export async function POST(request: Request) {
  try {
    const { url, actions } = await request.json();
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,  // Use new headless mode
    });
    
    const page = await browser.newPage();
    await page.goto(url);

    // Perform actions based on the request
    const result = await executeActions(page, actions);

    await browser.close();
    
    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    console.error('Browser automation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute browser actions' },
      { status: 500 }
    );
  }
}

async function executeActions(page: Page, actions: BrowserAction[]): Promise<ActionResult[]> {
  const results: ActionResult[] = [];
  
  for (const action of actions) {
    switch (action.type) {
      case 'click':
        await page.click(action.selector!);
        break;
      case 'type':
        await page.type(action.selector!, action.text!);
        break;
      case 'screenshot':
        const screenshot = await page.screenshot();
        results.push({ type: 'screenshot', data: Buffer.from(screenshot) });
        break;
      case 'getText':
        const text = await page.$eval(action.selector!, (element) => element.textContent || '');
        results.push({ type: 'text', data: text });
        break;
    }
  }
  
  return results;
} 