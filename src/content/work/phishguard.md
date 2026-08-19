---
title: PhishGuard
summary: AI-powered phishing URL detection with XGBoost, SHAP explanations, and calibrated confidence.
role: Creator / ML Engineer
date: 2025-09-15
tags: [Python, XGBoost, SHAP, FastAPI, Docker, GitHub Actions]
url: https://shauryarawat29.github.io/phishguard
repo: https://github.com/ShauryaRawat29/phishguard
featured: true
draft: false
---

## The problem

Phishing URLs are getting harder to spot by eye — short redirect chains, brand lookalikes, and homoglyphs slip past users and rule-based filters alike. I wanted a detector that doesn't just give a verdict but explains *why*, so people can trust it.

## How it works

1. **Feature extraction** — every URL is reduced to **33 deterministic lexical and structural features**: length, subdomain count, suspicious keywords, TLD type, entropy, brand-spoofing similarity, and more. All computed from the string itself.
2. **Model** — an **XGBoost** classifier trained on a **468K-URL dataset** scores the URL.
3. **Calibration** — raw model scores are run through **isotonic regression**, so the reported confidence means what it claims.
4. **Explainability** — **SHAP values** rank which features pushed the prediction, shown per-prediction in the UI.

## Key decisions

- **The server never visits the submitted URL.** No DNS lookups, no HTTP fetches — feature extraction is purely lexical. This eliminates the entire SSRF-style attack surface by design, and it means a scan can't be used to probe internal networks.
- **Calibrated confidence, not raw probabilities** — a 92% score actually means 92%, which matters when users act on the verdict.
- **Production hygiene** — Docker container, **100% test coverage**, CI/CD via GitHub Actions, rate-limited API, and the frontend is a dependency-free static app mirrored to GitHub Pages.

## Results

- **0.9973 F1, 0.9994 AUC** on the evaluation set.
- **Adversarial evasion < 1%** under leet, homoglyph, and encoding attacks.
- Deployed live: web UI on GitHub Pages + REST API on Render, with Swagger docs.

## What I learned

Building the whole pipeline end-to-end — features, training, a FastAPI backend, and a UI that shows the reasoning — taught me more than any single library. The biggest lesson: **explainability is a product feature**, not a research afterthought. A model you can interrogate is a model people will actually use.