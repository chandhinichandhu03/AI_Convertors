import os
import pandas as pd
from typing import Dict, Any, Optional
from app.services.ai.ollama_service import generate_local_completion

def clean_data_file(file_path: str, output_path: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Cleans tabular files (CSV, Excel, JSON) using Pandas. Drops duplicates, handles nulls, and standardizes schemas."""
    ext = file_path.split(".")[-1].lower()
    
    # 1. Load into DataFrame
    try:
        if ext == "csv":
            df = pd.read_csv(file_path)
        elif ext in ("xlsx", "xls"):
            df = pd.read_excel(file_path)
        elif ext == "json":
            df = pd.read_json(file_path)
        else:
            raise ValueError(f"Unsupported file type for data cleaning: {ext}")
    except Exception as e:
        return {"error": f"Failed to load file: {e}"}
        
    initial_rows, initial_cols = df.shape
    initial_nulls = int(df.isnull().sum().sum())
    initial_duplicates = int(df.duplicated().sum())
    
    # 2. Apply cleaning operations based on options
    if options.get("drop_duplicates", True):
        df = df.drop_duplicates()
        
    if options.get("drop_empty_rows", False):
        df = df.dropna(how="all")
        
    if options.get("normalize_headers", True):
        # strip spaces, convert to lowercase, replace spaces with underscores
        df.columns = df.columns.str.strip().str.lower().str.replace(r'\s+', '_', regex=True)
        
    fill_value = options.get("fill_null_value", None)
    if fill_value is not None:
        df = df.fillna(fill_value)
        
    final_rows, final_cols = df.shape
    final_nulls = int(df.isnull().sum().sum())
    
    # 3. Export to output file
    out_ext = output_path.split(".")[-1].lower()
    try:
        if out_ext == "csv":
            df.to_csv(output_path, index=False)
        elif out_ext in ("xlsx", "xls"):
            df.to_excel(output_path, index=False)
        elif out_ext == "json":
            df.to_json(output_path, orient="records", indent=2)
        else:
            # Fallback to CSV
            df.to_csv(output_path, index=False)
    except Exception as e:
        return {"error": f"Failed to export cleaned data: {e}"}
        
    return {
        "success": True,
        "initialRows": initial_rows,
        "initialCols": initial_cols,
        "initialNulls": initial_nulls,
        "initialDuplicates": initial_duplicates,
        "finalRows": final_rows,
        "finalCols": final_cols,
        "finalNulls": final_nulls,
        "cleanedHeaders": list(df.columns)
    }

# --- Language Operations using Ollama ---

async def translate_text_offline(text: str, from_lang: str, to_lang: str, model: str = "llama3") -> str:
    """Translates text between languages using local LLM prompts."""
    prompt = f"""
Translate the following text from {from_lang} to {to_lang}.
Return ONLY the translated text. Do not add any introductory or explaining sentences.

Text to translate:
{text}
"""
    return await generate_local_completion(prompt, model=model)

async def simplify_text_offline(text: str, tone: str, model: str = "llama3") -> str:
    """Simplifies, reformats, or adapts text tone to Casual, Formal, Academic, or Professional."""
    prompt = f"""
Rewrite and adapt the following text to have a strictly '{tone}' tone.
Return ONLY the modified text. Do not add any explanation or preamble.

Text:
{text}
"""
    return await generate_local_completion(prompt, model=model)

async def summarize_text_offline(text: str, model: str = "llama3") -> str:
    """Summarizes text block cleanly offline."""
    prompt = f"""
Summarize the following text block cleanly, highlighting key points.
Return ONLY the summary.

Text:
{text}
"""
    return await generate_local_completion(prompt, model=model)

async def paraphrase_text_offline(text: str, model: str = "llama3") -> str:
    """Paraphrases text block cleanly offline."""
    prompt = f"""
Paraphrase the following text block while maintaining its original meaning and context.
Return ONLY the paraphrased text.

Text:
{text}
"""
    return await generate_local_completion(prompt, model=model)
