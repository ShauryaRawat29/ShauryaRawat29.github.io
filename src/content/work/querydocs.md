---
title: QueryDocs
summary: Zero-cost RAG document Q&A — upload PDF/TXT/MD/DOCX and ask grounded questions with source citations.
role: Creator / ML Engineer
date: 2026-07-20
tags: [Python, FastAPI, FAISS, sentence-transformers, Next.js]
repo: https://github.com/ShauryaRawat29/querydocs
featured: true
draft: false
---

Implemented document chunking, embedding-based semantic retrieval over a persisted FAISS index, and context-aware answer synthesis with source citations.

Designed to run at **zero cost**: works with no API keys via an extractive mode, with optional Groq/OpenAI integration for natural-language answers. Next.js frontend with an ingestion-to-query flow that's fully smoke-tested.