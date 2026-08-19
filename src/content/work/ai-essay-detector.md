---
title: AI Essay Detector
summary: Evidence-based AI-writing analysis using sentence-level statistical signals scored against human baselines.
role: Creator / ML Engineer
date: 2026-01-20
tags: [Python, FastAPI, Next.js, statistical NLP]
repo: https://github.com/ShauryaRawat29/ai-essay-detector
featured: true
draft: false
---

Built for **Project 2 of the 2026 i12 HR Drive Hackathon**. The core stance: an AI-writing detector that gives a binary "AI or not" verdict is both dishonest and useless. This one measures *machine-like signals* and shows the evidence per sentence — with the limitations stated openly.

## How it works

1. **Sentence splitting** — the essay is split into sentences.
2. **Feature extraction (40 features)** — stylometric, syntax, and language-model signals per sentence. GPT-2 Medium is used **only as an instrument** to produce measurable signals: perplexity, entropy, token probability, rank.
3. **Baselines** — each feature is scored as a **z-score against human baselines** built from a 6K-essay human corpus, bucketed by essay length.
4. **Evidence, not verdicts** — every sentence gets an evidence level: **high** (≥2σ from baseline), **medium** (≥1σ), **low**, or **uncertain** (no comparable baseline). The UI shows the actual values vs. baselines for the top deviating signals.

## Key decisions

- **The LM never judges authorship.** GPT-2 is a measurement instrument; the assessment is made by our own feature extraction + baselines. No opaque "AI probability".
- **No data leakage.** Dataset splits happen at document level, never sentence level, so baselines are honest.
- **Documented provenance.** Dataset sources (VIORRA, LEAF, Ghostbuster-human), feature/model/baseline versions, and prompts are all recorded — reproducibility is part of the product.
- **Limitations are shipped as a feature.** ESL, heavily edited, short, or second-language essays can produce unusual signals for reasons unrelated to AI writing — that's stated in the UI, not buried.

## Results

- Full pipeline live end-to-end: feature extraction, human baselines, `/api/v1/analyze`, and an evidence-first frontend.
- **200+ tests**, ruff + mypy clean; every flag is backed by a shown signal.

## What I learned

The most valuable discipline was **defining what the tool must not claim**. Constraining the LM to instrumentation-only forced the design to be auditable — and "honest uncertainty" turned out to be the most defensible product position in the whole hackathon.