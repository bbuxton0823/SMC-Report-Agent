# SMC Report Generator

An AI-powered business report generator that creates professional reports using your writing style, policy documents, and data.

## Features

- Upload writing style samples to match your tone and style
- Include policy documents for reference
- Choose between different report types
- Upload data for analytics and visualizations
- Select from various AI models
- Adjust performance preferences
- Version control for your generated reports
- Python-based chart generation with matplotlib

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI API
- Anthropic API
- Python (for visualizations)
- Matplotlib

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file to add your API keys. See [ENV_README.md](ENV_README.md) for details.
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

This project uses environment variables for configuration. See [ENV_README.md](ENV_README.md) for a complete list of available variables and setup instructions.

Key environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `ENABLE_VERSION_CONTROL`: Enable/disable version control features

## API Routes

The application includes the following API routes:

- `POST /api/generate`: Generate a report based on input parameters
- `GET /api/versions`: Get all saved report versions
- `POST /api/versions`: Save a new report version
- `POST /api/charts`: Generate charts using Python visualization agent

## Version History

- v1.0: Initial release with basic functionality
- v1.1: Added Python-based chart generation and visualization agent

## License

MIT 
