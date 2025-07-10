#!/usr/bin/env python3
"""
fetch_docs.py - *super‑minimal* dataset generator for the MVP.

Goal
-----
Create exactly two artifacts so we can test the Rust lookup pipeline:

1. docs/archive/std/vector.html   (static copy of cppreference's page)
2. docs/index.json                {"std::vector": "<absolute path to vector.html"}

No tarballs, no lzma, no snapshots – we fetch a single page via ?raw=1.

Run
----
    python docs/fetch_docs.py
"""

from __future__ import annotations
import json
import pathlib
import sys
from urllib import request, error

RAW_URL = "https://en.cppreference.com/w/cpp/container/vector?raw=1"

ROOT = pathlib.Path(__file__).parent.resolve()
HTML_PATH = ROOT / "archive/std/vector.html"
INDEX_PATH = ROOT / "index.json"


def download_raw() -> bytes:
    print("⤵️  Downloading std::vector page…")
    try:
        with request.urlopen(RAW_URL, timeout=30) as resp:
            if resp.status != 200:
                raise RuntimeError(f"HTTP {resp.status}")
            return resp.read()
    except error.URLError as exc:
        sys.exit(f"❌ Download failed: {exc}")


def write_html(data: bytes) -> None:
    HTML_PATH.parent.mkdir(parents=True, exist_ok=True)
    HTML_PATH.write_bytes(data)
    print(f"📄 Saved HTML → {HTML_PATH.relative_to(ROOT)}")


def write_index() -> None:
    INDEX_PATH.write_text(
        json.dumps({"std::vector": str(HTML_PATH.resolve())}, indent=2)
    )
    print(f"✏️  Wrote index.json → {INDEX_PATH.relative_to(ROOT)}")


def main() -> None:
    write_html(download_raw())
    write_index()
    print("✅ Done – mini dataset ready.")


if __name__ == "__main__":
    main()