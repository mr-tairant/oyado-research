"""Convert a permitted snapshot into unverified, source-backed fact proposals.

Reads labelled JSON-LD fields only. Never infers dining, onsen or access.
"""
import argparse
import json
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIELDS = {'description': 'overview', 'address': 'address', 'amenityFeature': 'facilities', 'numberOfRooms': 'rooms'}

class StructuredHTML(HTMLParser):
    def __init__(self):
        super().__init__()
        self.capture = False
        self.buffer = ''
        self.blocks = []
    def handle_starttag(self, tag, attrs):
        if tag == 'script' and dict(attrs).get('type') == 'application/ld+json':
            self.capture = True
            self.buffer = ''
    def handle_data(self, data):
        if self.capture:
            self.buffer += data
    def handle_endtag(self, tag):
        if tag == 'script' and self.capture:
            self.capture = False
            try:
                self.blocks.append(json.loads(self.buffer))
            except json.JSONDecodeError:
                pass

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('snapshot_key')
    parser.add_argument('property_id')
    args = parser.parse_args()
    if not args.snapshot_key.isalnum() or not all(c.isalnum() or c == '-' for c in args.property_id):
        raise SystemExit('Invalid identifier')
    directory = ROOT / 'data/snapshots/private'
    meta = json.loads((directory / f'{args.snapshot_key}.json').read_text())
    html = StructuredHTML()
    html.feed((directory / f'{args.snapshot_key}.html').read_text(encoding='utf-8', errors='replace'))
    nodes = []
    for block in html.blocks:
        nodes.extend(block if isinstance(block, list) else block.get('@graph', [block]))
    facts = []
    for node in nodes:
        if not isinstance(node, dict):
            continue
        types = node.get('@type', [])
        types = [types] if isinstance(types, str) else types
        if not set(types).intersection({'Hotel', 'LodgingBusiness', 'Resort', 'BedAndBreakfast', 'Motel'}):
            continue
        for source_field, field in FIELDS.items():
            if node.get(source_field):
                facts.append({'field': field, 'value': json.dumps(node[source_field], ensure_ascii=False), 'source_url': meta['source_url'], 'source_name': 'Official page (identity pending)', 'retrieved_at': meta['retrieved_at'], 'confidence': 0.4, 'verification_status': 'unverified'})
    output = ROOT / 'data/extracted'
    output.mkdir(parents=True, exist_ok=True)
    (output / f'{args.property_id}.json').write_text(json.dumps({'property_id': args.property_id, 'facts': facts, 'unverified_fields': ['access', 'dining', 'onsen', 'highlights', 'international_traveler_notes'], 'note': 'Review extracted fields and property identity before copying to a live property.'}, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'{len(facts)} unverified proposals extracted; no public property modified')

if __name__ == '__main__':
    main()
