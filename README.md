# Local DeepSeek Chat Web App

A minimal full-stack web app for running and interacting with the DeepSeek LLM locally using Ollama.

## Features

- Clean and minimal chat interface
- Multiple chat sessions with tabs
- Persistent chat history using browser localStorage
- Smart scrolling with scroll-to-bottom indicator
- Local and secure LLM processing (possible without internet connectivity too)
- Dark mode interface

## Prerequisites

Before beginning, ensure you have the following installed:

1. **Python 3.8+**
   - Required for running the Flask backend.
   - Can be downloaded from [python.org](https://python.org).

2. **Ollama**
   - Required for running the LLM locally.
   - Can be downloaded from [ollama.ai/download](https://ollama.ai/download).

3. **DeepSeek Model**
   - After installing Ollama, pull the required model:
     ```bash
     ollama run deepseek-r1:14b
     ```
     Model Size: Around 9 GB. 

## Installation

1. Clone this repository on your local machine.
2. Install Flask:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. Ensure Ollama (with DeepSeek) is running:
   ```bash
   ollama list
   ```

2. In a new terminal, start the Flask application:
   ```bash
   python app.py
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## Usage

### Chat Interface

- Click '+ New Chat' to start a new conversation.
- Type your message in the input box and press Enter or click 'Send'.
- Switch between different chats using the tabs at the top.
- Triple-click a chat tab to reveal the delete button for the chat.
- Use the scroll indicator to scroll down through the chat.

## Project Structure

```
Local-DeepSeek-Web-App/
├── app.py              # Flask backend application
├── requirements.txt    # Python dependencies
├── static/
│   ├── script.js       # Frontend JavaScript
│   └── style.css       # CSS Styling
└── templates/
    └── index.html      # Main HTML template
```

## How It Works

1. The Flask backend (`app.py`) serves the web interface and handles chat requests.
2. When a message is sent:
   - It goes to the backend.
   - The backend calls Ollama with the DeepSeek model.
   - The model's response is streamed back to the frontend.
   - The conversation is saved in the browser's localStorage.
3. The frontend (`script.js`) manages:
   - Chat interface and user interactions
   - Message display and formatting
   - Chat history persistence
   - Tab management
   - Scroll behavior

## Contributing

Contributions are welcome!

## License

Distributed under the MIT License. 
