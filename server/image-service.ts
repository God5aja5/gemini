import fetch from "node-fetch";
import FormData from "form-data";

const STABLE_DIFFUSION_API_URL = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await fetch(STABLE_DIFFUSION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        steps: 30,
        width: 1024,
        height: 1024,
        seed: 0,
        cfg_scale: 7,
        samples: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.artifacts[0].base64;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}
