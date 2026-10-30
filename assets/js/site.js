// OpenGP's site. No build step; this runs as is.
//
// 1. The download buttons: pick the visitor's system, and when the release
//    on GitHub can be read, take the version, file names and sizes from it.
// 2. The screenshots' lightbox.
// 3. The hero's race loop: only where it is welcome.

(function () {
  "use strict";

  // ---- The release --------------------------------------------------
  // Change the version here when a release goes out; the release-page and
  // download addresses follow it. The GitHub lookup below overrides it once
  // the repository is public.
  const RELEASE = {
    repo: "OpenGP-dev/OpenGP",
    version: "1.0.1",
  };
  const PACKAGES = {
    windows: { suffix: "-windows-x64.zip" },
    linux:   { suffix: "-linux-x64.tar.gz" },
    macos:   { suffix: "-macos-arm64.tar.gz" },
  };

  function downloadUrl(os, version) {
    return `https://github.com/${RELEASE.repo}/releases/download/v${version}/OpenGP-${version}${PACKAGES[os].suffix}`;
  }

  function detectOS() {
    const ua = navigator.userAgent || "";
    const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    const p = (platform + " " + ua).toLowerCase();
    if (/iphone|ipad|ipod|android/.test(p)) return null;  // no package for phones
    if (p.includes("win")) return "windows";
    if (p.includes("mac")) return "macos";
    if (p.includes("linux") || p.includes("x11") || p.includes("cros")) return "linux";
    return null;
  }

  const NAMES = { windows: "Windows", linux: "Linux", macos: "macOS" };

  function applyDetected(os) {
    const hero = document.querySelector("[data-hero-download]");
    if (hero) {
      if (os) {
        hero.href = downloadUrl(os, RELEASE.version);
        hero.querySelector(".label").textContent = "Download for " + NAMES[os];
        hero.querySelector(".os").textContent = os === "macos" ? "Apple Silicon" : "";
      } else {
        hero.href = "#download";
        hero.querySelector(".label").textContent = "See the downloads";
        hero.querySelector(".os").textContent = "";
      }
    }
    document.querySelectorAll(".download-option").forEach((card) => {
      const mine = card.dataset.os === os;
      card.classList.toggle("detected", mine);
      const tag = card.querySelector(".tag");
      if (tag) tag.hidden = !mine;
      const button = card.querySelector(".button");
      if (button) {
        button.classList.toggle("primary", mine);
        button.classList.toggle("quiet", !mine);
      }
    });
    if (os) {
      // Put the visitor's system first.
      const grid = document.querySelector(".download-options");
      const card = grid && grid.querySelector(`.download-option[data-os="${os}"]`);
      if (card) grid.prepend(card);
    }
  }

  function formatSize(bytes) {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return mb >= 100 ? Math.round(mb) + " MB" : mb.toFixed(1) + " MB";
  }

  function applyRelease(release) {
    const version = String(release.tag_name || "").replace(/^v/, "");
    if (!version) return;
    RELEASE.version = version;
    document.querySelectorAll("[data-version]").forEach((el) => { el.textContent = version; });
    const assets = release.assets || [];
    Object.keys(PACKAGES).forEach((os) => {
      const asset = assets.find((a) => a.name.endsWith(PACKAGES[os].suffix));
      const card = document.querySelector(`.download-option[data-os="${os}"]`);
      if (!card) return;
      const button = card.querySelector(".button");
      const name = card.querySelector(".file .name");
      const size = card.querySelector(".file .size");
      if (asset) {
        button.href = asset.browser_download_url;
        if (name) name.textContent = asset.name;
        if (size) size.textContent = formatSize(asset.size);
      } else {
        button.href = downloadUrl(os, version);
        if (name) name.textContent = `OpenGP-${version}${PACKAGES[os].suffix}`;
      }
    });
    const hero = document.querySelector("[data-hero-download]");
    const os = detectOS();
    if (hero && os) {
      const asset = assets.find((a) => a.name.endsWith(PACKAGES[os].suffix));
      hero.href = asset ? asset.browser_download_url : downloadUrl(os, version);
    }
    document.querySelectorAll("[data-release-page]").forEach((a) => {
      if (release.html_url) a.href = release.html_url;
    });
  }

  function lookUpRelease() {
    if (!("fetch" in window)) return;
    fetch(`https://api.github.com/repos/${RELEASE.repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((release) => { if (release && release.tag_name) applyRelease(release); })
      .catch(() => { /* Offline, rate-limited or private: the page's own links stand. */ });
  }

  // ---- The lightbox --------------------------------------------------
  function setUpLightbox() {
    const dialog = document.querySelector("dialog.lightbox");
    if (!dialog || typeof dialog.showModal !== "function") return;
    const image = dialog.querySelector("img");
    const caption = dialog.querySelector("figcaption");
    const openers = Array.from(document.querySelectorAll("[data-full]"));
    let current = 0;

    function show(i) {
      current = (i + openers.length) % openers.length;
      const b = openers[current];
      image.src = b.dataset.full;
      image.alt = b.querySelector("img") ? b.querySelector("img").alt : "";
      caption.textContent = b.dataset.caption || image.alt;
    }
    openers.forEach((b, i) => {
      b.addEventListener("click", () => {
        show(i);
        dialog.showModal();
      });
    });
    dialog.querySelector(".prev").addEventListener("click", () => show(current - 1));
    dialog.querySelector(".next").addEventListener("click", () => show(current + 1));
    dialog.querySelector(".close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
    dialog.addEventListener("close", () => { image.removeAttribute("src"); });
  }

  // ---- The hero loop -------------------------------------------------
  function setUpHeroLoop() {
    const video = document.querySelector(".hero video");
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduced || saveData) {
      video.remove();  // the poster stays
      return;
    }
    // Play only while on screen; a background tab or a scrolled-past hero costs nothing.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      }, { threshold: 0.1 }).observe(video);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-version]").forEach((el) => { el.textContent = RELEASE.version; });
    applyDetected(detectOS());
    lookUpRelease();
    setUpLightbox();
    setUpHeroLoop();
  });
})();
