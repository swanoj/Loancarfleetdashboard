# Dashboard Scanner AI Integration Guide

The Dashboard Scanner component (`/src/app/components/DashboardScanner.tsx`) is currently using mock data for demonstration purposes. This guide explains how to integrate real AI vision APIs.

## Supported AI Vision APIs

### 1. OpenAI GPT-4 Vision (Recommended)
**Best for:** High accuracy, natural language understanding
**Cost:** ~$0.01-0.03 per image
**Setup:**
```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-4-vision-preview',
    messages: [{
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Analyze this car dashboard image. Extract: 1) Odometer reading in kilometers (number only) 2) Fuel level as percentage 0-100. Return ONLY a JSON object: {"odometer": number, "fuelLevel": number, "confidence": "high|medium|low"}'
        },
        {
          type: 'image_url',
          image_url: { url: imageDataUrl }
        }
      ]
    }],
    max_tokens: 300
  })
});

const data = await response.json();
const result = JSON.parse(data.choices[0].message.content);
```

### 2. Google Cloud Vision API
**Best for:** Fast processing, structured data extraction
**Cost:** ~$1.50 per 1000 images
**Setup:**
```typescript
const response = await fetch(
  `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [{
        image: { content: imageDataUrl.split(',')[1] }, // Base64 without data URL prefix
        features: [
          { type: 'TEXT_DETECTION', maxResults: 10 },
          { type: 'LABEL_DETECTION', maxResults: 5 }
        ]
      }]
    })
  }
);

const data = await response.json();
// Parse OCR text to extract odometer and fuel readings
const text = data.responses[0].textAnnotations[0].description;
```

### 3. Azure Computer Vision
**Best for:** Enterprise integration, OCR accuracy
**Cost:** ~$1.00 per 1000 images
**Setup:**
```typescript
const response = await fetch(
  `https://${process.env.AZURE_REGION}.api.cognitive.microsoft.com/vision/v3.2/read/analyze`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': process.env.AZURE_VISION_KEY
    },
    body: JSON.stringify({
      url: imageUrl // Or send image as binary
    })
  }
);
```

## Implementation Steps

### 1. Update the scanDashboard function in DashboardScanner.tsx

Replace the mock implementation (lines ~50-90) with your chosen API:

```typescript
const scanDashboard = async (imageData: string) => {
  setIsScanning(true);
  setError(null);
  
  try {
    // Example: OpenAI GPT-4 Vision
    const response = await fetch('/api/scan-dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData })
    });
    
    if (!response.ok) {
      throw new Error('Scan failed');
    }
    
    const result = await response.json();
    
    setScanResult({
      odometer: result.odometer,
      fuelLevel: result.fuelLevel,
      confidence: result.confidence,
      rawImage: imageData
    });
    
    if (onScanComplete) {
      onScanComplete(result);
    }
  } catch (err) {
    setError('Failed to scan dashboard. Please try again or enter values manually.');
    console.error('Scan error:', err);
  } finally {
    setIsScanning(false);
  }
};
```

### 2. Create a backend API endpoint

Create `/api/scan-dashboard` endpoint (if using Next.js, Remix, or similar):

```typescript
// Example: Next.js API route
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { image } = await request.json();
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4-vision-preview',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze this car dashboard. Extract odometer (km) and fuel level (%). Return JSON: {"odometer": number, "fuelLevel": number, "confidence": "high|medium|low"}'
          },
          {
            type: 'image_url',
            image_url: { url: image }
          }
        ]
      }],
      max_tokens: 300
    })
  });
  
  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);
  
  return NextResponse.json(result);
}
```

### 3. Environment Variables

Add to your `.env` file:
```env
# Choose one:
OPENAI_API_KEY=sk-...
GOOGLE_VISION_API_KEY=...
AZURE_VISION_KEY=...
AZURE_REGION=australiaeast
```

## Prompt Engineering Tips

For best results with GPT-4 Vision:

```
Analyze this car dashboard photo and extract the following information:

1. Odometer Reading: Look for the total kilometers traveled (usually 5-6 digits)
2. Fuel Level: Estimate the fuel gauge percentage (0-100%)

Return ONLY a JSON object in this exact format:
{
  "odometer": <number in kilometers>,
  "fuelLevel": <number 0-100>,
  "confidence": "<high|medium|low>"
}

Set confidence to:
- "high" if both values are clearly visible
- "medium" if one value is unclear but detectable
- "low" if either value is very unclear or not visible

Important:
- Odometer should be the TOTAL kilometers, not trip meter
- Fuel level should be 0-100 percentage
- Return only the JSON, no other text
```

## Error Handling

Handle common errors:
- **Poor image quality**: Show message asking user to retake photo
- **API timeout**: Implement retry logic with exponential backoff
- **Rate limits**: Queue requests and show estimated wait time
- **Parsing errors**: Fall back to manual entry

## Testing

Test with various dashboard photos:
1. Digital dashboards (Tesla, modern cars)
2. Analog gauges (older vehicles)
3. Poor lighting conditions
4. Reflections/glare
5. Partial visibility

## Cost Optimization

1. **Compress images** before sending (max 800px width)
2. **Cache results** for same image
3. **Batch process** if scanning multiple dashboards
4. **Use cheaper APIs** for high volume (Google Vision OCR)

## Security Considerations

1. Never expose API keys in frontend code
2. Implement rate limiting on your backend
3. Validate image size/type before processing
4. Add user authentication to prevent abuse
5. Consider GDPR compliance for storing images

## Current Implementation

The current demo implementation in `DashboardScanner.tsx` simulates AI processing with:
- 2-second delay to mimic API call
- Random but realistic odometer (10k-60k km)
- Random fuel level (20-100%)
- Confidence rating based on probability

This allows full UI testing without API costs during development.
