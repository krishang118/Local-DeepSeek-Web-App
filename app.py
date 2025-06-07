from flask import Flask, render_template, request, jsonify
import subprocess
import uuid
app = Flask(__name__)
chats = {}
@app.route("/")
def index():
    return render_template("index.html")
@app.route("/new_chat", methods=["POST"])
def new_chat():
    chat_id = str(uuid.uuid4())
    chats[chat_id] = []
    return jsonify({"chat_id": chat_id})
@app.route("/chat/<chat_id>", methods=["POST"])
def chat(chat_id):
    user_message = request.json.get("message", "")
    if chat_id not in chats:
        return jsonify({"error": "Invalid chat id"}), 404
    chats[chat_id].append({"role": "user", "content": user_message})
    history_text = "\n".join(
        f"{entry['role']}: {entry['content']}" for entry in chats[chat_id])
    prompt = f"""Local DeepSeek assistant:
You are a helpful AI assistant. When responding:
1. First show your thinking process, starting with "Thinking..." and ending with "Done thinking."
2. Then provide your final response
3. Be direct and concise in your final response
{history_text}
assistant:"""
    try:
        process = subprocess.Popen(
            ["ollama", "run", "deepseek-r1:14b"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True)        
        output, _ = process.communicate(prompt + "\n", timeout=60)
        answer = output.strip()        
        if not answer.lower().startswith("thinking..."):
            answer = "Thinking...\n" + answer
        if not "done thinking." in answer.lower():
            answer = answer + "\nDone thinking."
    except subprocess.TimeoutExpired:
        process.kill()
        answer = "Thinking...\nRequest timed out.\nDone thinking.\nSorry, the request timed out. Please try again."
    except Exception as e:
        answer = f"Thinking...\nError occurred: {str(e)}\nDone thinking.\nSorry, something went wrong. Please try again."
    chats[chat_id].append({"role": "assistant", "content": answer})
    return jsonify({"response": answer})
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)