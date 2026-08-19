---
title: Homelab & Self-Hosted Infrastructure
summary: A Proxmox VE homelab running since 2023 — DNS, media, notes, storage, git, passwords, monitoring, and smart home.
role: Owner / Sysadmin
date: 2023-04-01
tags: [Proxmox VE, Ubuntu Server, Docker, Linux, Networking, Home Assistant]
featured: false
draft: false
---

I've been running a self-hosted homelab since April 2023. What started as "can I make this old desktop do something useful" turned into the infrastructure that handles my network DNS, media, file sync, photo backup, git, passwords, and smart home — all on hardware that cost me nothing extra.

This page is the setup write-up: the hardware, the virtualization layer, the services I run, and the lessons I learned keeping it alive for three years.

## Hardware

The entire lab runs on one repurposed desktop:

- **CPU:** Intel Core i3 (8th generation)
- **RAM:** 16 GB DDR4
- **Storage:** a mix of SSDs (VMs/containers) and a large spinning disk (media, backups)
- **Network:** wired gigabit to the router; everything else goes through it

It is not a server-grade machine. It does not need to be. For a single-user homelab, an i3 with 16 GB of RAM comfortably hosts a dozen lightweight services, and the whole box idles at a fraction of the power a dedicated rack would draw.

## Hypervisor: Proxmox VE

I chose **Proxmox VE** as the hypervisor after trying plain Ubuntu Server and quickly outgrowing it. The reasons were practical:

- **Web UI out of the box** — create VMs and LXC containers, manage storage, and watch resource usage without SSHing in for everything.
- **LXC containers** — lighter than full VMs for most services, but I still keep a couple of full Ubuntu Server **VMs** for the heavier things and for learning real virtualization.
- **Snapshots** — click a button, roll back a broken update instead of reconfiguring for two hours.
- **Backups built in** — Proxmox Backup Server integration means the whole VM/container fleet gets snapshotted on a schedule.

## VM / container layout

I keep services in **Docker** where it makes sense, inside an Ubuntu Server VM. The rule I've settled on: one VM or container per logical job, so a failure in one service can't take down the rest.

The current layout looks like this:

- **`media` VM** — Jellyfin, *arr stack, media storage
- **`services` VM** — the main Docker host: DNS, storage, git, passwords, monitoring, photos
- **`iot` LXC** — Home Assistant and its Zigbee/MQTT bridge
- **`experiments` VM** — disposable Ubuntu Server VMs for testing things before they go anywhere near the rest of the lab

Everything else is a `docker-compose.yml` service on one of those hosts.

## Networking

- **Static IPs everywhere** — every VM and container gets a fixed lease; no service discovery roulette after a reboot.
- **SSH only, key-based** — password auth is disabled; keys are the only way in.
- **Reverse proxy** — a single entry point terminates traffic and routes by hostname, so each service has a clean, memorable URL instead of `ip:port` chaos.
- **VLANs** — the IoT network is segmented off from the main one. The smart-home gadgets are the least trustworthy devices on the network, so they get the least trust.
- **Firewall** — default-deny inbound on the host; only the ports I actually need are open.

## The services I run

### DNS ad-blocking (AdGuard Home)

The first service I ever deployed. AdGuard Home sits on the LAN as the DHCP-assigned DNS server, blocks ads and trackers at the network level, and gives me query logs for the whole house. It's been running for three years without a single manual restart.

### Media server (Jellyfin + *arr stack)

Jellyfin serves the media library to every device in the house — TV, phone, laptop — with no subscription and no phone-home. On its own it would only be a nice player, so the `media` VM pairs it with the **\*arr suite**, which does the boring work Jellyfin can't:

- **Sonarr** — TV shows: watches the watchlist, grabs new episodes as they release, and hands them to the downloader.
- **Radarr** — movies, same idea: build a wanted list once, let it collect.
- **Prowlarr** — the indexer hub: a single place to manage every indexer, and the one API both Sonarr and Radarr talk to.
- **Bazarr** — subtitles: fetches the right subtitle track automatically for whatever lands in the library.
- **qBittorrent** — the downloader the arrs feed; isolated in its own container with the firewall to match.

The flow is: watchlist → arr grabs it → downloader fetches it → files land in the media folder → Jellyfin picks them up and makes them watchable everywhere. Metadata (posters, fan art, episode guides) is pulled automatically, so the library stays tidy without manual curation.

### Cloud storage (Nextcloud)

Nextcloud is the self-hosted replacement for Google Drive. Files, contacts, and calendar sync across devices via the official clients, and nothing leaves the network. It doubles as the lab's file-sharing backbone — I mount parts of it into other containers so they can write backups to the same place.

### Note-taking (Obsidian)

Obsidian is my notes app — and the most-used service on the whole network. Every note is plain Markdown stored as a file, which is exactly why it fits a homelab: the vault lives on the `services` VM, and a file-sync layer (Syncthing) mirrors it to my laptop and phone. The same sync also gives me an always-offsite-ish copy of the vault, since it lands wherever I've got the folder open.

I keep the lab's own documentation here too — the write-ups for every service, the restore runbooks, and the "what broke and how I fixed it" log. When I need to remember how a setup works, I open the vault instead of the terminal.

### Photo backup (Immich)

Immich replaced the photo-automation part of the cloud: automatic backup from our phones, timeline view, face recognition, and search — all pointing at a local library instead of a third party.

### Self-hosted git (Gitea)

Gitea hosts the private repos I don't want to publish — scripts, compose files, dotfiles, this lab's own "infrastructure as code". It's light enough that it shares a host with other services without breaking a sweat.

### Password manager (Vaultwarden)

Vaultwarden is a lightweight drop-in for the Bitwarden server. Passwords sync across devices through the official Bitwarden clients, but the vault data lives on my own disk.

### Monitoring & dashboards (Uptime Kuma + Grafana)

Uptime Kuma pings every service on the network and alerts me if one drops. Grafana collects host metrics (CPU, RAM, disk, temperature) and renders the dashboard I open when something "feels slow". Between the two, a problem is usually diagnosed before I notice the symptoms.

### Docker management (Portainer)

Portainer is the GUI over Docker. I still write `docker-compose.yml` files by hand, but Portainer gives me logs, stats, and container state at a glance — and a one-click restart when something misbehaves.

### Smart home (Home Assistant)

Home Assistant runs in its own LXC with the Zigbee coordinator attached. Lights, sensors, and automations live here, and it integrates with the rest of the lab (e.g. Grafana-ingestion of sensor history, and a notification when the server room temperature climbs).

## Backup strategy

The rule I settled on after losing data once: **three copies, two of them local, one of them meaningfully different.**

- Proxmox snapshots of every VM/container on a schedule
- Nightly `restic`-style incremental backups of the important volumes to an external disk
- Critical credentials (vault export, SSH keys) exported to an offline location that survives even the house

I test a restore at least once every few months. A backup that has never been restored is a guess, not a backup.

## What three years taught me

- **Start with one service.** AdGuard Home taught me the loop — deploy, expose on the LAN, watch the logs — before I had a dozen containers to manage.
- **Write everything down.** Every service now has a README in my Gitea instance: compose file, ports, volumes, and the one-liner that restores it. Future-me is my most frequent customer.
- **Simplicity beats cleverness.** If I need a wiki to remember how a setup works, the setup is too complicated.
- **The homelab is the best Linux/networking teacher I've had.** Nothing in my degree taught me SSH hardening, VLAN design, or why `fsck` exists like accidentally breaking my own network at 1 a.m. did.

The lab has outlived two laptops and a router. It'll probably outlive this page's relevance too — but that's exactly the point. It keeps running, quietly, doing its job.