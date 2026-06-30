# Implementation Plan — Universal Offline Platform with Local AI & RAG

This document outlines the architecture, layout, and implementation tasks for expanding "OmniConvert AI" into a 100% offline, local AI platform powered by **Ollama**, local **Embeddings**, and a Retrieval-Augmented Generation (**RAG**) pipeline using FAISS.

---

## Technical Architecture

### 1. Local AI & RAG Pipeline
We will implement local AI workflows without cloud API dependencies:
* **Ollama Router (`backend/app/api/routers/ai_router.py`)**:
  * Scans `http://localhost:11434/api/tags` on startup to detect installed models (`llama3`, `mistral`, `deepseek`, `gemma`).
  * Routes chat, summarization, and email writing completions locally.
* **Embeddings Service (`backend/app/services/ai/embeddings_service.py`)**:
  * Generates vector representations using HuggingFace's `all-MiniLM-L6-v2` via `sentence-transformers` (or a robust TF-IDF fallback if hardware is restricted).
* **RAG & FAISS Vector Index (`backend/app/services/ai/rag_service.py`)**:
  * Extracts text from uploaded files (PDFs, DOCX, TXT).
  * Chunks text structures (500-character segments with 50-character overlaps).
  * Computes embeddings, indexes them in a local vector index, performs similarity searches, and passes retrieved context as LLM prompts.

### 2. File & CAD Converter Modules
* **CAD Converter**: Standardizes 3D mesh files (DXF, STL, OBJ) via local utility functions or scripts.
* **Finance Calculators**: Computes EMI, Loan schedules, Tax/GST, and Currency conversions (reading exchange data from local datasets).

### 3. Folder Layout Updates
We will adjust the backend directories to match the enterprise layout:
```
backend/
├── app/
│   ├── api/ (routers for auth, conversion, AI, settings)
│   ├── core/ (config, security)
│   ├── database/ (connection, models, schemas)
│   ├── services/
│   │   ├── converters/ (images, media, CAD)
│   │   ├── ai/ (ollama, embeddings, RAG, OCR)
│   │   └── utils/
│   └── workers/ (background tasks)
```

---

## User Review Required

> [!IMPORTANT]
> **Local Ollama Prerequisite**: To use the RAG and local chat features, **Ollama** must be running locally on your machine (`http://localhost:11434`). We will implement an automatic connection checker that alerts you if Ollama is offline, allowing standard file, scientific unit, and calculator pipelines to continue working normally.
> No cloud accounts or paid tokens are required.

---

## Proposed Changes

### [NEW] `backend/app/services/ai/ollama_service.py`
Connects to local Ollama. Queries `/api/tags` to list installed models and handles generation requests.

### [NEW] `backend/app/services/ai/embeddings_service.py`
Extracts text embeddings locally using `sentence-transformers`.

### [NEW] `backend/app/services/ai/rag_service.py`
Implements document chunking, FAISS vector queries, semantic indexing, and chat contexts.

### [NEW] `backend/app/services/converters/cad_converter.py`
Parses mesh headers for CAD formats.

---

## Verification Plan

### Automated Tests
* Run python checks to verify local Ollama route connections.
* Verify TypeScript builds cleanly.

### Manual Verification
1. Run `./run.sh` to boot the monorepo.
2. Confirm the dashboard dynamically lists detected Ollama models.
3. Upload a PDF, trigger RAG Indexing, and chat with the document completely offline.
