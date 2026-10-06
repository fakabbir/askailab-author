#!/usr/bin/env python3
"""One-shot Mintlify -> Docusaurus content migration.

Reads the .mdx pages in the repo root and writes Docusaurus-compatible pages
into ../docs. The transformations are component-name mappings only; no prose
is rewritten. Re-running overwrites the target files.
"""
import json
import re
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent.parent   # mintlify-docs/
DST = SRC / "docusaurus-docs" / "docs"

ADMONITIONS = {"Note": "note", "Tip": "tip", "Warning": "warning"}


def dedent(lines):
    widths = [len(l) - len(l.lstrip()) for l in lines if l.strip()]
    strip = min(widths) if widths else 0
    return [l[strip:] if l.strip() else "" for l in lines]


def split_frontmatter(text):
    if not text.startswith("---"):
        return "", text
    end = text.index("\n---", 3)
    return text[: end + 4], text[end + 4:].lstrip("\n")


def unwrap_mermaid(body):
    return re.sub(r"^</?Mermaid>\s*$", "", body, flags=re.M)


def collapse_codegroup(body):
    """<Code language title> wrapping a fence -> one titled fence."""
    pattern = re.compile(
        r'<Code\s+language="([^"]*)"[^>]*?title="([^"]*)"[^>]*>\s*```(\w*)\n(.*?)```\s*</Code>',
        re.S,
    )

    def repl(m):
        lang, title = m.group(1), m.group(2).replace('"', "'")
        fence_lang = m.group(3) or lang
        return f'```{fence_lang} title="{title}"\n{m.group(4).rstrip()}\n```'

    body, n = pattern.subn(repl, body)
    body = re.sub(r"^</?CodeGroup>\s*$", "", body, flags=re.M)
    return body, n


def convert_tabs(body):
    body = re.sub(r"^<Tabs>\s*$", "<Tabs>", body, flags=re.M)
    counter = {"i": 0}

    def repl(m):
        label = m.group(1)
        idx = counter["i"]
        counter["i"] += 1
        value = re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")[:32] or f"tab{idx}"
        default = " default" if idx == 0 else ""
        return f'<TabItem value="{value}" label="{label}"{default}>'

    body = re.sub(r'<Tab title="([^"]*)">', repl, body)
    return body.replace("</Tab>", "</TabItem>")


def convert_admonitions(body):
    for tag, kind in ADMONITIONS.items():
        pattern = re.compile(rf"<{tag}>\n(.*?)\n</{tag}>", re.S)
        body = pattern.sub(
            lambda m: ":::" + kind + "\n" + "\n".join(dedent(m.group(1).split("\n"))) + "\n:::",
            body,
        )
    return body


def convert_accordions(body):
    body = re.sub(r'^<Accordion title="([^"]*)">', r'<Accordion title="\1">', body)
    body = body.replace("</Accordion>", "</Accordion>")
    return body


def imports_for(used):
    lines = []
    if "Steps" in used:
        lines.append("import Steps, {Step} from '@site/src/components/Steps';")
    if "Accordion" in used:
        lines.append("import AccordionGroup, {Accordion} from '@site/src/components/Accordion';")
    if "Tabs" in used:
        lines.append("import Tabs from '@theme/Tabs';")
        lines.append("import TabItem from '@theme/TabItem';")
    return "\n".join(lines)


def main():
    config = json.loads((SRC / "docs.json").read_text())
    nav = {t["tab"]: t["pages"] for t in config["navigation"]["tabs"]}
    manifest = {}
    changed = []

    for tab, slugs in nav.items():
        for slug in slugs:
            src = SRC / f"{slug}.mdx"
            if not src.exists():
                print(f"!! missing source page: {slug}.mdx")
                continue
            raw = src.read_text()
            fm, body = split_frontmatter(raw)
            used = set()

            body = unwrap_mermaid(body)
            body, _ = collapse_codegroup(body)
            if "<Tabs>" in body:
                used.add("Tabs")
                body = convert_tabs(body)
            body = convert_admonitions(body)
            body = convert_accordions(body)
            if "<Steps>" in body:
                used.add("Steps")
            if "<AccordionGroup>" in body:
                used.add("Accordion")

            head = imports_for(used)
            out = (fm + "\n" + (head + "\n\n" if head else "") + body).rstrip() + "\n"
            DST.joinpath(f"{slug}.mdx").write_text(out)
            before, after = len(raw.split()), len(out.split())
            changed.append((slug, before, after))
            manifest.setdefault(tab, []).append(slug)

    print(f"{'page':<52}{'words in':>10}{'words out':>11}")
    for slug, b, a in changed:
        flag = "  <-- LOST CONTENT" if a < b * 0.95 else ""
        print(f"{slug:<52}{b:>10}{a:>11}{flag}")
    (Path(__file__).resolve().parent / "migration-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"\n{len(changed)} pages written to {DST}")


if __name__ == "__main__":
    DST.mkdir(parents=True, exist_ok=True)
    sys.exit(main())
