type BrowserAction = {
  type: 'click' | 'type' | 'screenshot' | 'getText';
  selector?: string;
  text?: string;
};

export async function executeBrowserActions(url: string, actions: BrowserAction[]) {
  try {
    const response = await fetch('/api/browser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, actions }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute browser actions');
    }

    return await response.json();
  } catch (error) {
    console.error('Browser service error:', error);
    throw error;
  }
} 