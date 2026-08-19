---
title: PhishGuard
summary: AI-powered phishing URL detection with XGBoost, SHAP explanations, and calibrated confidence.
role: Creator / ML Engineer
date: 2026-06-15
tags: [Python, XGBoost, SHAP, FastAPI, Docker, GitHub Actions]
url: https://shauryarawat29.github.io/phishguard
repo: https://github.com/ShauryaRawat29/phishguard
featured: true
draft: false
---

Trained an XGBoost classifier on a 468K-URL dataset — **0.9973 F1, 0.9994 AUC** — using 33 hand-crafted lexical and structural features. Every prediction is explained with SHAP values and calibrated confidence (isotonic regression); adversarial evasion stays under 1% against leet, homoglyph, and encoding attacks.

Containerized with Docker, 100% test coverage, CI/CD via GitHub Actions, and deployed live on GitHub Pages + Render as a web app with a REST API.