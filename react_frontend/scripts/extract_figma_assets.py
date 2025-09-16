#!/usr/bin/env python3
"""
PUBLIC_INTERFACE
extract_figma_assets.py

This script automates extraction of visual assets (SVG/PNG/icons) from a Figma file using the Figma REST API.
It saves the assets into assets/images/ and generates static HTML, CSS, and JS files referencing the exported images.

Usage:
  - Ensure the environment variable FIGMA_API_TOKEN is set with your Figma Personal Access Token.
  - Run:
      python scripts/extract_figma_assets.py --file-id <FIGMA_FILE_ID> [--page-id <PAGE_ID>] [--format svg] [--scale 1] [--output-prefix <prefix>]

Notes:
  - This script does not hardcode any secrets. FIGMA_API_TOKEN must be provided via environment variable.
  - It will create or reuse: assets/images/ and assets/generated/ directories.
  - The generated static UI files are written to assets/generated/figma-export-(prefix)/index.html, styles.css, app.js
  - The script tries to reference images where feasible. It also generates a manifest JSON to map Figma node names to local files.

Required environment variables:
  - FIGMA_API_TOKEN: Your Figma personal access token (PAT).

You can create a Figma PAT here: https://www.figma.com/developers/api#access-tokens
"""

import argparse
import json
import os
import sys
import time
from urllib.parse import urlencode

import shutil
import pathlib
import requests

FIGMA_API_BASE = "https://api.figma.com/v1"

# PUBLIC_INTERFACE
def safe_name(s: str) -> str:
    """Return a filesystem-safe filename fragment derived from a string."""
    return "".join(ch if ch.isalnum() or ch in ("-", "_") else "_" for ch in (s or "").strip()) or "node"

# PUBLIC_INTERFACE
def ensure_dir(path: str) -> None:
    """Ensure directory exists."""
    pathlib.Path(path).mkdir(parents=True, exist_ok=True)

# PUBLIC_INTERFACE
def figma_headers(token: str) -> dict:
    """Return HTTP headers for Figma API calls."""
    return {"X-Figma-Token": token}

def get_file(token: str, file_id: str) -> dict:
    """Fetch Figma file JSON."""
    url = f"{FIGMA_API_BASE}/files/{file_id}"
    r = requests.get(url, headers=figma_headers(token), timeout=60)
    r.raise_for_status()
    return r.json()

def get_file_nodes(token: str, file_id: str, node_ids: list[str]) -> dict:
    """Fetch specific nodes info."""
    params = urlencode({"ids": ",".join(node_ids)})
    url = f"{FIGMA_API_BASE}/files/{file_id}/nodes?{params}"
    r = requests.get(url, headers=figma_headers(token), timeout=60)
    r.raise_for_status()
    return r.json()

def get_images(token: str, file_id: str, node_ids: list[str], fmt: str = "svg", scale: float = 1.0) -> dict:
    """
    Request image render URLs from Figma for the given nodes in a specific format.
    Supported formats: 'svg', 'png', 'jpg', 'pdf'
    """
    params = {"ids": ",".join(node_ids), "format": fmt}
    if fmt in ("png", "jpg"):
        params["scale"] = str(scale)
    url = f"{FIGMA_API_BASE}/images/{file_id}?{urlencode(params)}"
    r = requests.get(url, headers=figma_headers(token), timeout=60)
    r.raise_for_status()
    return r.json()

def download_binary(url: str, out_path: str, attempts: int = 3, backoff: float = 2.0) -> None:
    """Download a binary file to out_path with retry."""
    for i in range(attempts):
        try:
            resp = requests.get(url, stream=True, timeout=120)
            resp.raise_for_status()
            with open(out_path, "wb") as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            return
        except Exception as e:
            if i == attempts - 1:
                raise
            time.sleep(backoff * (i + 1))

def walk_nodes_for_exportables(node: dict, page_id: str | None, collected: list[dict]) -> None:
    """
    DFS traversal to collect nodes likely to be exportable (frames, components, vectors, rectangles with images).
    If page_id is provided, only collect under that page.
    """
    node_type = node.get("type")
    node_id = node.get("id")
    is_page = node_type == "CANVAS"
    if page_id and is_page and node_id != page_id:
        # skip other pages altogether
        return
    # choose exportable types
    exportable_types = {"COMPONENT", "COMPONENT_SET", "INSTANCE", "VECTOR", "FRAME", "GROUP", "RECTANGLE", "ELLIPSE", "STAR", "POLYGON", "LINE", "TEXT"}
    if node_type in exportable_types:
        collected.append(node)

    for child in node.get("children", []) or []:
        walk_nodes_for_exportables(child, page_id, collected)

def guess_best_format_for_node(node: dict) -> str:
    """
    Guess the best export format for a node: prefer svg for vectors and icons, png for rasters.
    We will return 'svg' by default for VECTOR-ish types, 'png' for others.
    """
    node_type = node.get("type", "")
    vectorish = {"VECTOR", "STAR", "ELLIPSE", "POLYGON", "LINE", "BOOLEAN_OPERATION", "TEXT"}
    if node_type in vectorish:
        return "svg"
    # For frames, components, groups: PNG generally better
    return "png"

def unique_name(base: str, taken: set[str]) -> str:
    """Ensure unique filename by appending counters if needed."""
    name = base
    counter = 1
    while name in taken:
        counter += 1
        name = f"{base}_{counter}"
    taken.add(name)
    return name

# PUBLIC_INTERFACE
def extract_assets(token: str, file_id: str, page_id: str | None, output_img_dir: str, output_prefix: str, scale: float = 2.0) -> dict:
    """
    Extract assets from figma and save to output_img_dir.
    Returns a manifest dictionary with node to file mappings.
    """
    file_json = get_file(token, file_id)
    doc = file_json.get("document", {})
    pages = doc.get("children", []) or []

    # Collect nodes
    nodes_for_export: list[dict] = []
    for page in pages:
        if page_id is not None and page.get("id") != page_id:
            continue
        walk_nodes_for_exportables(page, None if page_id is None else page_id, nodes_for_export)

    # Reduce to a reasonable set to avoid hammering API: only leaf-like or those with 'exportSettings'
    filtered_nodes = []
    for n in nodes_for_export:
        if n.get("exportSettings"):
            filtered_nodes.append(n)
        else:
            # consider leaf nodes (no children) as likely exportable graphic units
            if not n.get("children"):
                filtered_nodes.append(n)

    if not filtered_nodes:
        filtered_nodes = nodes_for_export  # fallback

    # Prepare filenames
    taken_names: set[str] = set()
    node_id_to_file: dict[str, dict] = {}
    for n in filtered_nodes:
        node_id = n.get("id")
        node_name = n.get("name") or n.get("type") or "node"
        base = safe_name(node_name)[:60] or "node"
        base = f"{output_prefix}-{base}" if output_prefix else base
        fmt = guess_best_format_for_node(n)
        fname = unique_name(f"{base}.{fmt}", taken_names)
        node_id_to_file[node_id] = {"name": node_name, "filename": fname, "format": fmt, "type": n.get("type")}

    # Request image URLs grouped by format
    by_format: dict[str, list[str]] = {}
    for nid, meta in node_id_to_file.items():
        by_format.setdefault(meta["format"], []).append(nid)

    ensure_dir(output_img_dir)

    # Fetch and download
    for fmt, ids in by_format.items():
        # Figma limits: send in chunks
        CHUNK = 80
        for i in range(0, len(ids), CHUNK):
            chunk_ids = ids[i : i + CHUNK]
            imgs = get_images(token, file_id, chunk_ids, fmt=fmt, scale=scale)
            err = imgs.get("err")
            if err:
                print(f"[WARN] get_images error: {err}", file=sys.stderr)
            images_map = imgs.get("images", {})
            for nid in chunk_ids:
                url = images_map.get(nid)
                if not url:
                    continue
                out_filename = node_id_to_file[nid]["filename"]
                out_path = os.path.join(output_img_dir, out_filename)
                try:
                    download_binary(url, out_path)
                except Exception as e:
                    print(f"[ERROR] download failed for node {nid}: {e}", file=sys.stderr)

    manifest = {
        "fileId": file_id,
        "pageId": page_id,
        "outputDir": output_img_dir,
        "exported": [
            {"nodeId": nid, **meta} for nid, meta in node_id_to_file.items()
            if os.path.exists(os.path.join(output_img_dir, meta["filename"]))
        ],
    }
    return manifest

# PUBLIC_INTERFACE
def generate_static_site(manifest: dict, output_root: str, site_prefix: str) -> dict:
    """
    Generate simple static site files (index.html, styles.css, app.js) referencing exported assets.
    Returns info dict with paths.
    """
    out_dir = os.path.join(output_root, f"figma-export-{site_prefix or 'site'}")
    ensure_dir(out_dir)

    # Basic grid of images with captions
    items_html = []
    exported = manifest.get("exported", [])
    rel_images_path = os.path.relpath(manifest["outputDir"], out_dir).replace("\\", "/")
    for item in sorted(exported, key=lambda x: x.get("filename", "")):
        img_src = f"{rel_images_path}/{item['filename']}"
        caption = f"{item.get('name','')} ({item.get('type','')})"
        items_html.append(f"""
        <figure class="asset-card">
          <img src="{img_src}" alt="{caption}">
          <figcaption>{caption}</figcaption>
        </figure>
        """.strip())

    index_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Figma Export - {site_prefix or 'site'}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="./styles.css">
</head>
<body>
  <header class="site-header">
    <h1>Figma Assets</h1>
    <p>Exported from file: <code>{manifest.get('fileId')}</code>{' (page: '+manifest.get('pageId')+')' if manifest.get('pageId') else ''}</p>
  </header>
  <main class="gallery">
    {"".join(items_html) if items_html else "<p>No assets exported.</p>"}
  </main>
  <script src="./app.js"></script>
</body>
</html>
""".strip()

    styles_css = """
:root {
  --bg: #0f172a;
  --panel: #111827;
  --text: #e5e7eb;
  --muted: #9ca3af;
  --accent: #22c55e;
  --border: #1f2937;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
.site-header { padding: 24px; border-bottom: 1px solid var(--border); background: var(--panel); position: sticky; top: 0; }
.site-header h1 { margin: 0 0 6px 0; font-size: 20px; }
.site-header p { margin: 0; color: var(--muted); font-size: 13px; }
.gallery { padding: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
.asset-card { margin: 0; padding: 10px; background: var(--panel); border: 1px solid var(--border); border-radius: 10px; }
.asset-card img { display: block; width: 100%; height: 160px; object-fit: contain; background: #0b1220; border-radius: 8px; }
.asset-card figcaption { margin-top: 8px; font-size: 12px; color: var(--muted); word-break: break-word; }
@media (max-width: 480px) {
  .gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
""".strip()

    app_js = """
// Placeholder for interactions, in case you want to enhance preview later.
console.log("Figma assets gallery loaded");
""".strip()

    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(index_html)
    with open(os.path.join(out_dir, "styles.css"), "w", encoding="utf-8") as f:
        f.write(styles_css)
    with open(os.path.join(out_dir, "app.js"), "w", encoding="utf-8") as f:
        f.write(app_js)

    return {"out_dir": out_dir, "index": os.path.join(out_dir, "index.html")}

def main():
    parser = argparse.ArgumentParser(description="Extract assets (SVG/PNG/icons) from a Figma file and generate a static UI.")
    parser.add_argument("--file-id", required=True, help="Figma file ID")
    parser.add_argument("--page-id", required=False, help="Optional Figma page (node) ID to limit extraction")
    parser.add_argument("--format", default="auto", choices=["auto", "svg", "png"], help="Preferred export format (default: auto)")
    parser.add_argument("--scale", default=2.0, type=float, help="Scale factor for raster exports (png/jpg) (default: 2.0)")
    parser.add_argument("--output-prefix", default="", help="Prefix for filenames and site folder")
    args = parser.parse_args()

    token = os.environ.get("FIGMA_API_TOKEN")
    if not token:
        print("ERROR: Environment variable FIGMA_API_TOKEN is not set.", file=sys.stderr)
        sys.exit(2)

    # Prepare output directories
    project_root = pathlib.Path(__file__).resolve().parents[1]
    images_dir = project_root / "assets" / "images"
    ensure_dir(str(images_dir))

    # Extract
    manifest = extract_assets(
        token=token,
        file_id=args.file_id,
        page_id=args.page_id,
        output_img_dir=str(images_dir),
        output_prefix=safe_name(args.output_prefix or args.file_id[:8]),
        scale=args.scale,
    )

    # Save manifest
    generated_root = project_root / "assets" / "generated"
    ensure_dir(str(generated_root))
    site_prefix = args.output_prefix or args.file_id[:8]
    manifest_path = generated_root / f"manifest-{safe_name(site_prefix)}.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    # Generate static site referencing images
    site_info = generate_static_site(manifest, str(generated_root), safe_name(site_prefix))
    print("Export complete.")
    print(f"- Images directory: {images_dir}")
    print(f"- Manifest: {manifest_path}")
    print(f"- Static site: {site_info['index']}")

if __name__ == "__main__":
    main()
