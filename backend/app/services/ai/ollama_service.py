import httpx
from typing import List, Dict, Any, Optional

OLLAMA_HOST = "http://localhost:11434"

async def list_local_models() -> List[str]:
    """Queries local Ollama endpoint to retrieve all installed model tags."""
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{OLLAMA_HOST}/api/tags", timeout=5)
            if res.status_code == 200:
                models_data = res.json().get("models", [])
                return [m["name"] for m in models_data]
    except Exception:
        pass
    return []

async def generate_local_completion(prompt: str, model: str = "llama3") -> str:
    """Generates a text completion response using the specified local Ollama model."""
    url = f"{OLLAMA_HOST}/api/generate"
    data = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    # Verify if model is installed, otherwise fall back to any active model
    installed = await list_local_models()
    if installed and model not in installed:
        data["model"] = installed[0]  # Fall back to first available model
        
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(url, json=data, timeout=90)
            if res.status_code == 200:
                return res.json().get("response", "")
            else:
                return f"[Ollama Error: Status {res.status_code}]"
    except Exception as e:
        return f"[Connection to local Ollama failed: {e}. Ensure Ollama is running on port 11434]"

async def chat_local_completion(messages: List[Dict[str, str]], model: str = "llama3") -> str:
    """Processes chat sequences with local Ollama, preserving contextual message lists."""
    url = f"{OLLAMA_HOST}/api/chat"
    data = {
        "model": model,
        "messages": messages,
        "stream": False
    }
    
    installed = await list_local_models()
    if installed and model not in installed:
        data["model"] = installed[0]
        
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(url, json=data, timeout=90)
            if res.status_code == 200:
                return res.json().get("message", {}).get("content", "")
            else:
                return f"[Ollama Error: Status {res.status_code}]"
    except Exception as e:
        return f"[Connection to local Ollama failed: {e}. Ensure Ollama is running on port 11434]"
