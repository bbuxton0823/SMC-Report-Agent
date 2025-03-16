# Environment Variables

This document describes the environment variables used in the SMC Report Generator application.

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file to set your API keys and configuration.

## Available Environment Variables

### API Configuration

- `NEXT_PUBLIC_API_URL`: The URL for the API endpoints. Default: `http://localhost:3000/api`

### AI Model API Keys

- `OPENAI_API_KEY`: Your OpenAI API key for generating reports.
- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude models.

### Feature Flags

- `ENABLE_ANALYTICS`: Enable or disable analytics features. Default: `true`
- `ENABLE_VERSION_CONTROL`: Enable or disable version control features. Default: `true`

### Application Settings

- `MAX_UPLOAD_SIZE`: Maximum file upload size in bytes. Default: `10485760` (10MB)
- `DEFAULT_MODEL`: Default AI model to use. Default: `gpt-4`

## Security Notes

- Never commit your `.env` file to version control.
- The `.env.example` file should not contain any real API keys or sensitive information.
- In production, use a secure method to manage environment variables (e.g., environment variables in your hosting platform).

## Using Environment Variables

### In Server-Side Code

```typescript
import { OPENAI_API_KEY } from '@/lib/env';

// Use the environment variable
if (OPENAI_API_KEY) {
  // Do something with the API key
}
```

### In Client-Side Code

Only environment variables prefixed with `NEXT_PUBLIC_` are available in client-side code:

```typescript
import { API_URL } from '@/lib/env';

// Use the environment variable
fetch(`${API_URL}/endpoint`);
``` 