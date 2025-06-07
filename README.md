# Local DeepSeek Chat

A lightweight, local chat interface for interacting with the DeepSeek AI model using Ollama. This application provides a clean, modern UI for having conversations with the DeepSeek model while keeping everything running locally on your machine.

## Features

- 💬 Clean, modern chat interface
- 🔄 Multiple chat sessions with tabs
- 💾 Persistent chat history using browser localStorage
- ⌨️ Keyboard shortcuts for efficient interaction
- 🎯 Smart scrolling with scroll-to-bottom indicator
- 🎨 Dark mode interface
- 🔒 Local-first: All processing happens on your machine
- 🚀 Fast and responsive UI
- 📱 Mobile-friendly design

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Python 3.8+**
   - Required for running the Flask backend
   - Can be downloaded from [python.org](https://python.org)

2. **Ollama**
   - Required for running the AI model locally
   - Installation instructions:
     - macOS: `curl https://ollama.ai/install.sh | sh`
     - Linux: `curl https://ollama.ai/install.sh | sh`
     - Windows: Download from [ollama.ai](https://ollama.ai/download)
     - For other systems, check [ollama.ai/download](https://ollama.ai/download)

3. **DeepSeek Model**
   - After installing Ollama, pull the required model:
     ```bash
     ollama pull deepseek-r1:14b
     ```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/local-deepseek.git
   cd local-deepseek
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. Ensure Ollama is running:
   ```bash
   ollama serve
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

- Click "+ New Chat" to start a new conversation
- Type your message in the input box and press Enter or click Send
- Switch between different chats using the tabs at the top
- Triple-click a chat tab to reveal the delete button
- Use the scroll indicator (↓) to quickly return to the bottom of the chat

### Keyboard Shortcuts

- `Enter`: Send message
- `Shift + Enter`: New line in message
- `Esc`: Clear input field
- `Ctrl/Cmd + N`: New chat
- `Ctrl/Cmd + Tab`: Switch between chats
- `Ctrl/Cmd + Delete`: Delete current chat (if multiple chats exist)

## Project Structure

```
local-deepseek/
├── app.py              # Flask backend application
├── requirements.txt    # Python dependencies
├── static/
│   ├── script.js      # Frontend JavaScript
│   └── style.css      # Styling
└── templates/
    └── index.html     # Main HTML template
```

## Dependencies

### Python Dependencies
- Flask==3.0.0
- Werkzeug==3.0.1
- Jinja2==3.1.3
- itsdangerous==2.1.2
- click==8.1.7
- MarkupSafe==2.1.5

### System Dependencies
- Ollama (latest version)
- deepseek-r1:14b model

### Browser Requirements
- Modern web browser with support for:
  - ES6+ JavaScript
  - CSS Grid and Flexbox
  - localStorage API
  - fetch API
  - Custom scrollbar styling (WebKit)

## How It Works

1. The Flask backend (`app.py`) serves the web interface and handles chat requests
2. When a message is sent:
   - The message is sent to the backend
   - The backend calls Ollama with the DeepSeek model
   - The model's response is streamed back to the frontend
   - The conversation is saved in the browser's localStorage
3. The frontend (`script.js`) manages:
   - Chat interface and user interactions
   - Message display and formatting
   - Chat history persistence
   - Tab management
   - Scroll behavior

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Ollama](https://ollama.ai) for providing the local AI model infrastructure
- [DeepSeek](https://deepseek.ai) for the AI model
- [Flask](https://flask.palletsprojects.com/) for the web framework 