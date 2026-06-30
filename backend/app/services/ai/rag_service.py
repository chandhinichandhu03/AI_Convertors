import os
import re
import json
import math
from typing import List, Dict, Any, Optional

# Global variables for FAISS and SentenceTransformers
_use_faiss = False
_transformer_model = None
_faiss_index = None
_kb_chunks: List[str] = []

# Memory store for dynamic user upload chunks (mapped by file_id)
_rag_store: Dict[str, List[Dict[str, Any]]] = {}

# Try importing AI/Vector libraries
try:
    import faiss
    import numpy as np
    from sentence_transformers import SentenceTransformer
    _use_faiss = True
    print("✓ FAISS and Sentence Transformers imported successfully.")
except Exception as e:
    print(f"⚠️ FAISS/Sentence Transformers loading failed. Falling back to TF-IDF Cosine Matcher. Error: {e}")

def clean_text(text: str) -> str:
    """Standardizes string characters and normalizes multiple spaces."""
    return re.sub(r'\s+', ' ', text).strip()

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Slices a text block into chunk_size character arrays with overlap windows."""
    chunks = []
    text = clean_text(text)
    if not text:
        return []
        
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += (chunk_size - overlap)
    return chunks

# ─── File Text Extractors ──────────────────────────────────────────────────────

def extract_text_from_file(file_path: str) -> str:
    ext = file_path.split(".")[-1].lower()
    
    if ext == "pdf":
        try:
            import pypdf
            reader = pypdf.PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += (page.extract_text() or "") + "\n"
            return text
        except Exception as e:
            return f"[Error reading PDF: {e}]"
            
    elif ext == "docx":
        try:
            import docx
            doc = docx.Document(file_path)
            return "\n".join([p.text for p in doc.paragraphs])
        except Exception as e:
            return f"[Error reading DOCX: {e}]"
            
    elif ext in ("png", "jpg", "jpeg", "webp", "bmp", "tiff"):
        try:
            import pytesseract
            from PIL import Image
            return pytesseract.image_to_string(Image.open(file_path))
        except Exception as e:
            return f"[OCR scanner failed: {e}]"
            
    else:
        # Standard text fallback (txt, md, html, csv, json, yaml, rtf)
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except Exception:
            return ""

# ─── Pure Python Cosine Keyword Matcher (Fallback & Dynamic Uploads) ──────────

def get_term_vector(text: str) -> Dict[str, int]:
    """Constructs a term-frequency vector representation for a text string."""
    words = re.findall(r'\w+', text.lower())
    vector: Dict[str, int] = {}
    for w in words:
        if len(w) > 2:  # skip tiny words
            vector[w] = vector.get(w, 0) + 1
    return vector

def compute_cosine_similarity(vec1: Dict[str, int], vec2: Dict[str, int]) -> float:
    """Computes cosine similarity between two term-frequency vector mappings."""
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])
    
    sum1 = sum([vec1[x]**2 for x in vec1.keys()])
    sum2 = sum([vec2[x]**2 for x in vec2.keys()])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)
    
    if not denominator:
        return 0.0
    return float(numerator) / denominator

# ─── Global RAG Knowledge Base Bootstrapping ──────────────────────────────────

# Fallback in-memory keyword-matching structures for global KB
_kb_term_vectors: List[Dict[str, Any]] = []

def bootstrap_knowledge_base(kb_dir: str):
    """Scans kb_dir folder, extracts text, chunks it, and builds a FAISS/SentenceTransformer index."""
    global _transformer_model, _faiss_index, _kb_chunks, _use_faiss, _kb_term_vectors
    
    if not os.path.exists(kb_dir):
        print(f"⚠️ Knowledge base directory not found at: {kb_dir}")
        return
        
    all_chunks = []
    
    # Traverse directory and read files
    for root_dir, _, files in os.walk(kb_dir):
        for file in files:
            if file.endswith((".md", ".txt", ".pdf")):
                path = os.path.join(root_dir, file)
                text = extract_text_from_file(path)
                chunks = chunk_text(text, chunk_size=500, overlap=50)
                all_chunks.extend(chunks)
                
    if not all_chunks:
        print("⚠️ No documents indexed in the knowledge base.")
        return
        
    _kb_chunks = all_chunks
    print(f"✓ Found {len(_kb_chunks)} total text chunks in knowledge base.")
    
    # Try initializing vector index
    if _use_faiss:
        try:
            print("⏳ Initializing SentenceTransformer model ('all-MiniLM-L6-v2')...")
            # Set HF cache directory locally inside the app appData/cache if desired, or let it load
            _transformer_model = SentenceTransformer("all-MiniLM-L6-v2")
            print("⏳ Computing vector embeddings for chunks...")
            embeddings = _transformer_model.encode(_kb_chunks)
            
            # FAISS Index Flat L2 (384 dimensions for all-MiniLM-L6-v2)
            dimension = embeddings.shape[1]
            import numpy as np
            _faiss_index = faiss.IndexFlatL2(dimension)
            _faiss_index.add(np.array(embeddings).astype('float32'))
            print(f"✓ FAISS Vector database seeded with {len(_kb_chunks)} chunks.")
            return
        except Exception as ex:
            print(f"⚠️ FAISS/SentenceTransformer startup failed. Defaulting to keyword fallbacks. Error: {ex}")
            _use_faiss = False
            
    # If FAISS failed or wasn't available, build Term-Frequency list
    print("⏳ Building in-memory TF vectors for keyword search fallback...")
    _kb_term_vectors = []
    for idx, chunk in enumerate(_kb_chunks):
        _kb_term_vectors.append({
            "index": idx,
            "text": chunk,
            "vector": get_term_vector(chunk)
        })
    print(f"✓ Fallback matcher seeded with {len(_kb_chunks)} chunks.")

def retrieve_kb_context(query: str, top_k: int = 4) -> str:
    """Finds matching chunks from the global knowledge base using FAISS or TF Cosine Fallback."""
    global _use_faiss, _faiss_index, _transformer_model, _kb_chunks, _kb_term_vectors
    
    if not _kb_chunks:
        return ""
        
    if _use_faiss and _faiss_index is not None and _transformer_model is not None:
        try:
            import numpy as np
            query_vector = _transformer_model.encode([query])
            distances, indices = _faiss_index.search(np.array(query_vector).astype('float32'), top_k)
            
            matched_chunks = []
            for idx in indices[0]:
                if idx < len(_kb_chunks) and idx >= 0:
                    matched_chunks.append(_kb_chunks[idx])
            return "\n\n".join(matched_chunks)
        except Exception as ex:
            print(f"RAG Retrieval Exception: {ex}. Falling back...")
            
    # Keyword cosine matching fallback
    query_vector = get_term_vector(query)
    if not query_vector:
        return ""
        
    scored = []
    for item in _kb_term_vectors:
        score = compute_cosine_similarity(query_vector, item["vector"])
        scored.append((score, item["text"]))
        
    scored.sort(key=lambda x: x[0], reverse=True)
    top_matches = [text for score, text in scored[:top_k] if score > 0.0]
    return "\n\n".join(top_matches) if top_matches else ""

# ─── Dynamic Upload File Actions ──────────────────────────────────────────────

def index_document(file_id: str, file_path: str):
    """Extracts, chunks, and registers document terms inside the local memory store for pinned chat file."""
    full_text = extract_text_from_file(file_path)
    chunks = chunk_text(full_text)
    
    indexed_chunks = []
    for idx, c in enumerate(chunks):
        vector = get_term_vector(c)
        indexed_chunks.append({
            "id": idx,
            "text": c,
            "vector": vector
        })
        
    _rag_store[file_id] = indexed_chunks
    print(f"✓ Indexed file {file_id}: {len(chunks)} chunks registered in dynamic search index.")

def retrieve_relevant_context(file_id: str, query: str, top_k: int = 3) -> str:
    """Finds top_k matching chunks in document index to return as query context."""
    chunks = _rag_store.get(file_id)
    if not chunks:
        return ""
        
    query_vector = get_term_vector(query)
    if not query_vector:
        return ""
        
    scored_chunks = []
    for c in chunks:
        score = compute_cosine_similarity(query_vector, c["vector"])
        scored_chunks.append((score, c["text"]))
        
    scored_chunks.sort(key=lambda x: x[0], reverse=True)
    top_matches = [text for score, text in scored_chunks[:top_k] if score > 0.0]
    return "\n\n".join(top_matches) if top_matches else ""
