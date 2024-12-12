# Cursor AI Proxy Server

A proxy server that converts OpenAI-style API requests to Cursor AI format.

## Features
- OpenAI API compatible endpoints
- Support for streaming responses
- Multiple API key rotation
- Error handling and logging

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see below)
4. Start the server: `npm start`

## Environment Variables
- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: localhost)

## API Endpoints
- GET `/v1/models` - List available models
- POST `/v1/chat/completions` - Create chat completion
- GET `/test` - Test endpoint

## Docker Support
