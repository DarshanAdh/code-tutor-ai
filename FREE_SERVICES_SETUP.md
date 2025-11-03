# 🆓 Free Services Setup Guide for CodeTutor AI

This guide shows how to set up the CodeTutor AI system using completely free APIs and local services.

## 🚀 Quick Start

### 1. **Ollama (Local LLM - No API Key Needed)**

**Install Ollama:**
```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download
```

**Start Ollama:**
```bash
ollama serve
```

**Pull a model:**
```bash
ollama pull llama3
# or
ollama pull mistral
```

**Test:**
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Explain recursion in Python"
}'
```

### 2. **Hugging Face (Free API)**

**Get API Key:**
1. Create account at [huggingface.co](https://huggingface.co)
2. Go to Settings → Access Tokens
3. Create a new token

**Set Environment Variable:**
```bash
HUGGINGFACE_API_KEY=your_token_here
```

### 3. **Piston API (Free Code Execution)**

**No setup needed!** Piston API is completely free and public.

**Test:**
```bash
curl -X POST https://emkc.org/api/v2/piston/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "python3",
    "version": "3.10.0",
    "files": [{"name": "main.py", "content": "print(\"Hello CodeTutor AI\")"}]
  }'
```

### 4. **Whisper (Local Speech-to-Text)**

**Install:**
```bash
pip install openai-whisper
```

**Test:**
```python
import whisper
model = whisper.load_model("base")
result = model.transcribe("audio.mp3")
print(result["text"])
```

### 5. **Coqui TTS (Local Text-to-Speech)**

**Install:**
```bash
pip install TTS
```

**Test:**
```python
from TTS.api import TTS
tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC")
tts.tts_to_file("Hello student!", "output.wav")
```

## 🔧 Environment Configuration

Create `server/.env`:

```bash
# MongoDB (required)
# Prefer MONGO_URI; MONGODB_URI is also supported
MONGO_URI=mongodb://localhost:27017/codetutor
MONGODB_URI=

# Free AI Services
# Either OLLAMA_URL or OLLAMA_BASE_URL works
OLLAMA_URL=http://localhost:11434
OLLAMA_BASE_URL=
OLLAMA_MODEL=llama3
HUGGINGFACE_API_KEY=your_hf_token_here
HUGGINGFACE_MODEL=tiiuae/falcon-7b-instruct

# Free Code Execution
PISTON_API_URL=https://emkc.org/api/v2/piston

# Local Voice Services
WHISPER_MODEL_PATH=base
COQUI_MODEL=tts_models/en/ljspeech/tacotron2-DDC

# Optional: Premium Services (if you have them)
OPENAI_API_KEY=
GEMINI_API_KEY=
GOOGLE_APPLICATION_CREDENTIALS=
JUDGE0_API_KEY=
```

## 🎯 API Endpoints

### Free AI Services
- `POST /api/ai-tutor/free/ask` - Ask coding questions (Ollama/HuggingFace)
- `POST /api/ai-tutor/free/execute` - Execute code (Piston API)
- `POST /api/ai-tutor/free/speech-to-text` - Convert voice to text (Whisper)
- `POST /api/ai-tutor/free/text-to-speech` - Convert text to speech (Coqui TTS)
- `GET /api/ai-tutor/status` - Check service availability

### Premium Services (if configured)
- `POST /api/ai-tutor/ask` - OpenAI/Gemini questions
- `POST /api/ai-tutor/execute` - Judge0 code execution
- `POST /api/ai-tutor/speech-to-text` - Google Cloud Speech
- `POST /api/ai-tutor/text-to-speech` - Google Cloud TTS

## 🚀 Running the Application

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd ../
npm install
npm run dev
```

### Test Free Services
```bash
# Test AI question
curl -X POST http://localhost:4000/api/ai-tutor/free/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Explain bubble sort", "language": "python"}'

# Test code execution
curl -X POST http://localhost:4000/api/ai-tutor/free/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Hello World\")", "language": "python"}'

# Check service status
curl http://localhost:4000/api/ai-tutor/status
```

## 💡 Service Priority

The system automatically chooses the best available service:

1. **AI Provider Priority:**
   - OpenAI (if API key provided)
   - Gemini (if API key provided)
   - Hugging Face (if API key provided)
   - Ollama (local, default)

2. **Code Execution Priority:**
   - Judge0 (if API key provided)
   - Piston API (free, default)

3. **Voice Services Priority:**
   - Google Cloud (if credentials provided)
   - Whisper/Coqui TTS (local, default)

## 🔍 Troubleshooting

### Ollama Issues
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve
```

### Whisper Issues
```bash
# Check if Whisper is installed
whisper --version

# Install if missing
pip install openai-whisper
```

### Coqui TTS Issues
```bash
# Check if TTS is installed
tts --version

# Install if missing
pip install TTS
```

### Piston API Issues
```bash
# Test Piston API directly
curl https://emkc.org/api/v2/piston/runtimes
```

## 📊 Cost Comparison

| Service | Cost | Setup |
|---------|------|-------|
| Ollama | Free | Local installation |
| Hugging Face | Free | API token |
| Piston API | Free | No setup |
| Whisper | Free | Local installation |
| Coqui TTS | Free | Local installation |
| OpenAI | Paid | API key |
| Google Cloud | Paid | Service account |
| Judge0 | Paid | API key |

## 🎉 Benefits of Free Services

- **No API costs** - Run completely free
- **Privacy** - All processing happens locally
- **Offline capability** - Works without internet
- **Customization** - Use any model you want
- **No rate limits** - Process as much as you want

## 🔄 Migration from Premium to Free

The system automatically detects available services and uses the best option. You can:

1. Start with free services (Ollama + Piston)
2. Add premium services later (OpenAI + Judge0)
3. Mix and match as needed

The frontend will automatically use the best available service for each feature!
