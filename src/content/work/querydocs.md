---
title: QueryDocs
summary: Zero-cost RAG document Q&A — upload PDF/TXT/MD/DOCX and ask grounded questions with source citations.
role: Creator / ML Engineer
date: 2025-12-15
tags: [Python, FastAPI, FAISS, sentence-transformers, Next.js]
repo: https://github.com/ShauryaRawat29/querydocs
featured: true
draft: false
---

## The problem

"Just ask the PDF" is the standard RAG pitch — but most RAG demos quietly depend on paid LLM APIs and hallucinate answers with no citations. I wanted a document Q&A that answers *grounded* questions with the sources shown, and works even with **zero API keys**.

## How it works

1. **Ingest** — upload a PDF/TXT/MD/DOCX; the backend chunks the document, embeds each chunk with **all-MiniLM-L6-v2**, and writes them to a **persisted FAISS index**.
2. **Query** — your question is embedded and matched against the index for semantic retrieval.
3. **Answer** — with no LLM key, the top-matching passages are returned directly (**extractive mode**). With an optional Groq/OpenAI key, the LLM synthesizes a natural-language answer — but is prompted to answer *only* from the retrieved context, so every answer cites the chunks it used.

## Key decisions

- **Zero-cost by design.** The default path needs no paid API and no keys — it's fully functional on the free tier, which is why it's deployable to Render + Vercel with a $0 bill.
- **Grounded answers, not parroted text.** Synthesis is context-constrained and citations are part of the response contract, so users can verify instead of trust.
- **Stateless and deployable.** The backend is a single FastAPI app with three endpoints (`/api/health`, `/api/ingest`, `/api/query`), and the Next.js frontend proxies the API cleanly.
- **Privacy-friendly.** Documents are never sent to a third party unless you explicitly add an LLM key.

## Results

The full ingest → query flow is smoke-tested end-to-end (upload, index, ask, get cited answer), the backend runs on the free tier, and the whole thing is ready to deploy with `render.yaml`.

## What I learned

RAG's hard part isn't the model — it's **the retrieval pipeline and honest evaluation**. Designing a system that degrades gracefully (extractive when there's no budget for an LLM) forced me to think about costs and failure modes up front, not after deployment.