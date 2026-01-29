#!/usr/bin/env python3
import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import Request, urlopen

CONFIG_ENV = "MACRO_PUBLISH_CONFIG"
DEFAULT_CONFIG = Path(__file__).resolve().parent / "publish_config.json"


def load_config() -> dict:
    config_path = Path(Path.cwd() / DEFAULT_CONFIG)
    if CONFIG_ENV in os.environ:
        config_path = Path(os.environ[CONFIG_ENV])
    if not config_path.exists():
        raise FileNotFoundError(f"Config not found: {config_path}")
    with config_path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def request_json(url: str, headers: dict) -> dict:
    req = Request(url, headers=headers or {})
    with urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def normalize_series(payload):
    if payload is None:
        return []
    if isinstance(payload, list):
        return normalize_array(payload)
    if isinstance(payload, dict):
        for key in ("series", "data", "results", "result", "observations", "items"):
            if key in payload:
                return normalize_series(payload[key])
        # fallback map
        points = [
            {"date": k, "value": v}
            for k, v in payload.items()
            if isinstance(v, (int, float, str))
        ]
        return normalize_array(points)
    return []


def normalize_array(items):
    points = []
    for item in items:
        if isinstance(item, list) and len(item) >= 2:
            points.append(make_point(item[0], item[1]))
        elif isinstance(item, dict):
            date_key = pick_key(item, ["date", "period", "time", "timestamp", "month", "quarter"])
            value_key = pick_key(item, ["value", "v", "rate", "yoy", "index", "level", "close"])
            if date_key and value_key:
                points.append(make_point(item[date_key], item[value_key]))
    points = [p for p in points if p]
    points.sort(key=lambda p: p["date"])
    return points


def pick_key(obj, keys):
    for key in keys:
        if key in obj:
            return key
    return None


def make_point(date_raw, value_raw):
    if date_raw is None or value_raw is None:
        return None
    if isinstance(date_raw, (int, float)):
        ts = date_raw / 1000 if date_raw > 1e12 else date_raw
        date_str = datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
    else:
        date_str = str(date_raw)[:10]
    try:
        value = float(value_raw)
    except (ValueError, TypeError):
        return None
    return {"date": date_str, "value": value}


def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)


def write_json(path: Path, payload: dict):
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)


def main():
    try:
        config = load_config()
    except Exception as exc:
        print(f"Config error: {exc}")
        return 1

    base_url = config.get("base_url", "")
    headers = config.get("headers", {})
    sources = config.get("sources", [])
    output_dir = Path(config.get("output_dir", "data/live"))
    ensure_dir(output_dir)

    manifest = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "sources": []
    }

    for source in sources:
        source_id = source.get("id")
        path = source.get("path") or source.get("url")
        if not source_id or not path:
            continue
        url = path if path.startswith("http") else urljoin(base_url.rstrip("/") + "/", path.lstrip("/"))
        status = "ok"
        try:
            payload = request_json(url, headers)
            series = normalize_series(payload)
            if not series:
                raise ValueError("empty series")
            out = {
                "id": source_id,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "series": series
            }
            write_json(output_dir / f"{source_id}.json", out)
        except Exception as exc:
            status = f"error: {exc}"
        manifest["sources"].append({"id": source_id, "url": url, "status": status})
        time.sleep(0.2)

    write_json(output_dir / "manifest.json", manifest)
    print("Wrote live data to", output_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
