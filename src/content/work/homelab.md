---
title: Infrastructure & Security Engineering
summary: Proxmox VE cluster (15+ VMs) with VLANs, DNS, Traefik, Loki/Prometheus/Grafana, hardening, vuln management (OpenVAS/Trivy/Sigma), AD security lab.
role: Owner / Sysadmin
date: 2023-04-01
tags: [Proxmox VE, Ubuntu Server, Docker, Linux, Networking, Prometheus, Grafana, Loki, Traefik, VLANs, fail2ban, nftables, auditd, OpenVAS, Trivy, Sigma, Lynis, BloodHound, Kerberos, Active Directory]
featured: true
draft: false
---

I've been running a self-hosted homelab since April 2023. What started as "can I make this old desktop do something useful" turned into a multi-node Proxmox VE cluster (15+ Ubuntu VMs) that handles network DNS, reverse proxy, centralized logging, metrics, and a full security engineering stack.

## Virtualization & Infrastructure

- **Hypervisor:** Proxmox VE cluster — web UI, LXC containers, snapshots, scheduled backups via Proxmox Backup Server
- **Compute:** 15+ Ubuntu Server VMs and LXC containers, one VM or container per logical service
- **Networking:** Static IPs everywhere, SSH key-only access, VLAN segmentation (IoT isolated), default-deny firewall
- **Reverse proxy:** Traefik — single entry point, hostname-based routing, automatic TLS
- **DNS:** Pi-hole / Unbound — ad-blocking at network level, recursive resolver
- **Service orchestration:** Docker Compose per host, Portainer for management

## Observability

- **Metrics:** Prometheus + Grafana — host metrics (CPU, RAM, disk, temperature), custom dashboards
- **Logging:** Loki — centralized log aggregation from all VMs/containers
- **Uptime:** Uptime Kuma — service health checks, alerting on drops

## Security Hardening (Baseline)

- **Host hardening:** fail2ban (brute-force protection), nftables (firewall), auditd (audit logging), unattended-upgrades (auto security patches), SSH key-only access
- **Compliance:** Lynis auditing — automated compliance scoring across the fleet
- **Container security:** Docker daemon hardening, read-only root filesystems where possible, non-root containers

## Vulnerability Management Pipeline

- **Scanning:** Scheduled OpenVAS (network/service vulns) + Trivy (container image & filesystem scans)
- **Triage:** Automated CVE prioritization workflow — CVSS scoring, asset criticality, exploit availability
- **Detection engineering:** Sigma rule validation — converting threat intel into detection rules, testing against Loki logs
- **Remediation tracking:** Ticket-based workflow from detection → patch → verification

## Active Directory Security Lab

Dedicated AD environment for attack-path analysis and detection rule development:

- **Kerberos security:** Delegation auditing (unconstrained/constrained/resource-based), Kerberoasting (SPN scanning, ticket extraction), AS-REP roasting (pre-auth disabled accounts)
- **Attack path analysis:** BloodHound — graph-based AD mapping, shortest-path to domain admin, tier-zero identification
- **Detection rules:** MITRE ATT&CK-mapped Sigma rules for T1558 (Kerberoasting), T1208 (Kerberos delegation), T1003 (credential dumping), T1069 (permission groups discovery)
- **Tooling:** Custom PowerShell/Python audit scripts, integrated with Loki for real-time alerting

## Backup Strategy

Three copies, two local, one meaningfully different:
- Proxmox snapshots (scheduled, per-VM/container)
- Nightly restic incremental backups to external disk
- Critical credentials (vault export, SSH keys) offline, survives physical loss
- Restore tested quarterly — a backup never restored is a guess

## What This Taught Me

- **Start small, iterate:** AdGuard Home taught the deploy → expose → monitor loop before scaling
- **Document everything:** Every service has a runbook (compose, ports, volumes, restore one-liner) in Gitea
- **Simplicity > cleverness:** If it needs a wiki to operate, it's too complex
- **Security is a process, not a product:** Hardening baseline + continuous scanning + detection engineering = defensible posture
- **The homelab is the best teacher:** SSH hardening, VLAN design, Kerberos internals, fsck recovery — nothing in coursework matches breaking your own network at 1 a.m.