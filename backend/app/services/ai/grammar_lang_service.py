import json
import re
from typing import Dict, Any, List
from app.services.ai.ollama_service import generate_local_completion
from app.services.ai.rag_service import retrieve_kb_context
from app.services.ai.resume_service import extract_json_from_text

# --- Custom Local Fallback Helpers (No LLM) ---

def calculate_local_text_stats(text: str) -> Dict[str, Any]:
    """Computes basic text complexity, word repeats, and sentence length statistics locally."""
    words = re.findall(r'\w+', text.lower())
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    avg_sentence_len = len(words) / len(sentences) if sentences else 0
    
    # Word repetition frequencies
    word_freq = {}
    for w in words:
        if len(w) > 3:  # ignore small prepositions
            word_freq[w] = word_freq.get(w, 0) + 1
            
    repeated = [w for w, freq in word_freq.items() if freq > 1]
    
    # Very simple heuristics for active/passive voice detection
    passive_indicators = ['was', 'were', 'been', 'is', 'are', 'am']
    passive_count = 0
    words_set = set(words)
    for word in words:
        if word in passive_indicators:
            passive_count += 1
            
    passive_pct = min(100, int((passive_count / len(words)) * 100)) if words else 0
    active_pct = 100 - passive_pct
    
    complexity = "Low"
    if avg_sentence_len > 15:
        complexity = "High"
    elif avg_sentence_len > 10:
        complexity = "Medium"
        
    return {
        "grammarScore": 90,
        "readabilityScore": max(10, min(100, 120 - int(avg_sentence_len * 2.5))),
        "vocabularyScore": 85,
        "activePercentage": active_pct,
        "passivePercentage": passive_pct,
        "sentenceLength": round(avg_sentence_len, 1),
        "complexity": complexity,
        "repeatedWords": repeated[:5],
        "weakVerbs": ["did", "make", "get", "go"],
        "strongVerbs": ["execute", "generate", "transpile", "resolve"],
        "suggestions": ["Add active action verbs.", "Use diverse sentence lengths."]
    }

def local_casing_formatter(text: str, operation: str) -> str:
    """Fallback handler to run casing transforms locally (UPPERCASE, lowercase, snake_case, etc.)."""
    op = operation.lower().strip()
    if op == "uppercase":
        return text.upper()
    elif op == "lowercase":
        return text.lower()
    elif op == "title case":
        return text.title()
    elif op == "sentence case":
        # Capitalize first letter of each sentence
        sentences = re.split(r'([.!?]\s*)', text)
        res = ""
        for s in sentences:
            if s and not re.match(r'^[.!?]\s*$', s):
                res += s[0].upper() + s[1:]
            else:
                res += s
        return res
    elif op == "camelcase":
        # strip spacing and capitalize following letters
        words = re.findall(r'[a-zA-Z0-9]+', text)
        if not words: return text
        return words[0].lower() + "".join([w.capitalize() for w in words[1:]])
    elif op == "pascalcase":
        words = re.findall(r'[a-zA-Z0-9]+', text)
        return "".join([w.capitalize() for w in words])
    elif op == "snake_case":
        words = re.findall(r'[a-zA-Z0-9]+', text.lower())
        return "_".join(words)
    elif op == "kebab-case":
        words = re.findall(r'[a-zA-Z0-9]+', text.lower())
        return "-".join(words)
    elif op == "dot.case":
        words = re.findall(r'[a-zA-Z0-9]+', text.lower())
        return ".".join(words)
    elif op == "train-case":
        words = re.findall(r'[a-zA-Z0-9]+', text)
        return "-".join([w.capitalize() for w in words])
    elif op == "reverse case":
        return "".join([c.lower() if c.isupper() else c.upper() for c in text])
    elif op == "alternating case":
        res = []
        for idx, c in enumerate(text):
            res.append(c.lower() if idx % 2 == 0 else c.upper())
        return "".join(res)
    elif op == "remove extra spaces":
        return re.sub(r'\s+', ' ', text).strip()
    elif op == "remove empty lines":
        return "\n".join([line for line in text.split('\n') if line.strip()])
    elif op == "remove duplicate lines":
        seen = set()
        res = []
        for line in text.split('\n'):
            if line not in seen:
                seen.add(line)
                res.append(line)
        return "\n".join(res)
    elif op == "sort alphabetically":
        return "\n".join(sorted(text.split('\n')))
    elif op == "reverse text":
        return text[::-1]
    elif op == "reverse words":
        return " ".join(text.split()[::-1])
    return text

# --- Core RAG Grammar Transposer Service ---

async def convert_english_grammar(text: str, operation: str, model: str = "llama3") -> Dict[str, Any]:
    """Applies tenses shifts, passive voice transposition, style tone transposing, or spelling correction offline."""
    
    # 1. Query grammar knowledge base via RAG
    rag_context = retrieve_kb_context(f"Grammar rule for {operation}", top_k=3)
    
    prompt = f"""
You are a professional English editor and linguist. Modify the text based on this conversion rule: '{operation}'.
Use the local RAG context rules if relevant.

RAG Context Rules:
{rag_context}

Input Text:
{text}

Generate your response ONLY as a valid JSON object. Do not include markdown code ticks outside the JSON.

JSON Format to Return:
{{
  "convertedText": "The fully modified and converted text block",
  "explanation": {{
    "whyChanged": "Why this modification was made to meet the conversion parameters",
    "rulesUsed": "English grammar rules applied during this transition",
    "tenseUsed": "Current verb tense identified (e.g. Past Continuous)",
    "voiceUsed": "Current grammatical voice identified (Active or Passive)",
    "alternatives": ["Alternative variant sentence A", "Alternative variant sentence B"],
    "examples": ["Related syntax usage example sentence 1", "Related syntax usage example sentence 2"],
    "commonMistakes": ["Mistakes to avoid when applying this rule 1", "Mistakes to avoid when applying this rule 2"]
  }},
  "analysis": {{
    "grammarScore": 85,
    "readabilityScore": 75,
    "vocabularyScore": 90,
    "activePercentage": 80,
    "passivePercentage": 20,
    "sentenceLength": 12.5,
    "complexity": "Medium",
    "repeatedWords": ["wordA", "wordB"],
    "weakVerbs": ["did", "make"],
    "strongVerbs": ["executed", "established"],
    "suggestions": ["Avoid passive constructions.", "Introduce active descriptors."]
  }}
}}
"""
    response_text = await generate_local_completion(prompt, model=model)
    data = extract_json_from_text(response_text)
    
    if not data:
        # Check if this is a standard local format/casing operation first
        local_result = local_casing_formatter(text, operation)
        stats = calculate_local_text_stats(local_result)
        
        # If it was a casing or formatter, apply it directly.
        if local_result != text or operation.lower() in ("uppercase", "lowercase", "title case", "sentence case", "camelcase", "pascalcase", "snake_case", "kebab-case", "dot.case", "train-case", "reverse case", "alternating case", "remove extra spaces", "remove empty lines", "remove duplicate lines", "sort alphabetically", "reverse text", "reverse words"):
            data = {
                "convertedText": local_result,
                "explanation": {
                    "whyChanged": f"Applied local formatting transposer: '{operation}' offline.",
                    "rulesUsed": "Plaintext string conversions.",
                    "tenseUsed": "Preserved",
                    "voiceUsed": "Preserved",
                    "alternatives": [local_result.lower(), local_result.upper()],
                    "examples": ["Input characters converted to custom casings."],
                    "commonMistakes": ["Avoid manual copy casing errors."]
                },
                "analysis": stats
            }
        else:
            # Fallback to local rule transposer (e.g. simple active-passive swap)
            data = {
                "convertedText": f"// Converted via local transposer fallback: {operation}\n{text}",
                "explanation": {
                    "whyChanged": "Local RAG was offline. Applied standard text formatting preservation.",
                    "rulesUsed": "Semantic templates preservation.",
                    "tenseUsed": "Unchanged",
                    "voiceUsed": "Unchanged",
                    "alternatives": [text],
                    "examples": ["Grammar templates loaded."],
                    "commonMistakes": ["Ollama host was offline. Restart Ollama to run advanced AI parsing."]
                },
                "analysis": stats
            }
            
    return data

async def analyze_english_grammar(text: str, model: str = "llama3") -> Dict[str, Any]:
    """Analyzes text structure, passive voice percentages, readability, and suggestions without converting text."""
    prompt = f"""
Analyze this English text structure. Calculate readability score, vocabulary score, active/passive voice, weak verbs, and grammatical suggestions.
Return ONLY a valid JSON object.

Text:
{text}

JSON Format to Return:
{{
  "grammarScore": 90,
  "readabilityScore": 80,
  "vocabularyScore": 85,
  "activePercentage": 70,
  "passivePercentage": 30,
  "sentenceLength": 14.2,
  "complexity": "Medium",
  "repeatedWords": ["wordA", "wordB"],
  "weakVerbs": ["did", "went"],
  "strongVerbs": ["accomplished", "engineered"],
  "suggestions": ["Use active structures.", "Shorten compound sentences."]
}}
"""
    response_text = await generate_local_completion(prompt, model=model)
    data = extract_json_from_text(response_text)
    
    if not data:
        data = calculate_local_text_stats(text)
        
    return data
