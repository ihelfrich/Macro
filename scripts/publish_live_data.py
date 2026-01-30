#!/usr/bin/env python3
import json
import os
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode, urljoin
from urllib.request import Request, urlopen

CONFIG_ENV = "MACRO_PUBLISH_CONFIG"
DEFAULT_CONFIG = Path(__file__).resolve().parent / "publish_config.json"
ENV_PATTERN = re.compile(r"\$\{([^}]+)\}")
FRED_BASE = "https://api.stlouisfed.org/fred"


def load_config() -> dict:
    config_path = Path(Path.cwd() / DEFAULT_CONFIG)
    if CONFIG_ENV in os.environ:
        config_path = Path(os.environ[CONFIG_ENV])
    if not config_path.exists():
        raise FileNotFoundError(f"Config not found: {config_path}")
    with config_path.open("r", encoding="utf-8") as handle:
        raw = json.load(handle)
    return expand_env(raw)


def expand_env(value):
    if isinstance(value, dict):
        return {k: expand_env(v) for k, v in value.items()}
    if isinstance(value, list):
        return [expand_env(v) for v in value]
    if isinstance(value, str):
        return ENV_PATTERN.sub(lambda match: os.environ.get(match.group(1), ""), value)
    return value


def request_json(url: str, headers=None) -> dict:
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


def fred_request(endpoint: str, api_key: str, params=None) -> dict:
    query = {"api_key": api_key, "file_type": "json"}
    if params:
        query.update({k: v for k, v in params.items() if v not in (None, "")})
    url = f"{FRED_BASE}/{endpoint}?{urlencode(query)}"
    return request_json(url)


def resolve_fred_series(source: dict, api_key: str):
    if source.get("series_id"):
        return source["series_id"], {}

    search_text = source.get("search") or source.get("title") or source.get("label")
    if not search_text:
        raise ValueError("Missing series_id or search text")

    results = fred_request(
        "series/search",
        api_key,
        {
            "search_text": search_text,
            "limit": 15,
            "order_by": "popularity",
            "sort_order": "desc"
        }
    )
    series_list = results.get("seriess", [])
    if not series_list:
        raise ValueError(f"No FRED results for search: {search_text}")

    title_target = (source.get("title") or source.get("label") or "").lower().strip()
    match = None
    if title_target:
        for series in series_list:
            if series.get("title", "").lower().strip() == title_target:
                match = series
                break
    if not match:
        match = series_list[0]

    return match["id"], match


def fetch_fred_series(source: dict, config: dict, api_key: str):
    series_id, meta = resolve_fred_series(source, api_key)
    params = {}
    params.update(config.get("fred_defaults", {}))
    params.update(source.get("params", {}))
    if config.get("observation_start"):
        params.setdefault("observation_start", config.get("observation_start"))
    params["series_id"] = series_id

    payload = fred_request("series/observations", api_key, params)
    series = normalize_series(payload)
    return series, meta, series_id


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

    fred_api_key = config.get("fred_api_key") or os.environ.get(config.get("fred_api_key_env", "FRED_API_KEY"))

    manifest = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "sources": []
    }

    for source in sources:
        source_id = source.get("id")
        if not source_id:
            continue
        provider = (source.get("provider") or "").lower()
        status = "ok"
        meta = {}
        url = source.get("url") or source.get("path") or ""
        try:
            if provider == "fred":
                if not fred_api_key:
                    raise ValueError("Missing FRED api key")
                series, meta, series_id = fetch_fred_series(source, config, fred_api_key)
                if not series:
                    raise ValueError("empty series")
                meta_payload = {
                    "series_id": series_id,
                    "title": meta.get("title"),
                    "units": meta.get("units"),
                    "frequency": meta.get("frequency"),
                    "seasonal_adjustment": meta.get("seasonal_adjustment")
                }
                out = {
                    "id": source_id,
                    "label": source.get("label"),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                    "meta": meta_payload,
                    "series": series
                }
                write_json(output_dir / f"{source_id}.json", out)
                url = f"{FRED_BASE}/series/observations?series_id={series_id}"
            else:
                if not url:
                    raise ValueError("Missing url/path")
                url = url if url.startswith("http") else urljoin(base_url.rstrip("/") + "/", url.lstrip("/"))
                payload = request_json(url, headers)
                series = normalize_series(payload)
                if not series:
                    raise ValueError("empty series")
                out = {
                    "id": source_id,
                    "label": source.get("label"),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                    "series": series
                }
                write_json(output_dir / f"{source_id}.json", out)
        except Exception as exc:
            status = f"error: {exc}"
        manifest["sources"].append(
            {
                "id": source_id,
                "label": source.get("label"),
                "provider": provider or "custom",
                "url": url,
                "status": status
            }
        )
        time.sleep(0.2)

    write_json(output_dir / "manifest.json", manifest)
    print("Wrote live data to", output_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
