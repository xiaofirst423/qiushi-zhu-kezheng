// Generate browser data without changing the complete research source.
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const root = path.join(__dirname, "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "assets/data/graph-data.json"), "utf8"));
const types = Object.keys(source.stats.nodeTypeCounts);
const layers = Object.keys(source.stats.layerCounts);
const predicates = [...new Set(source.edges.map((edge) => edge.predicate))];
const components = [...new Set(source.nodes.map((node) => node.componentId))];
const nodeIndex = new Map(source.nodes.map((node, index) => [node.id, index]));
const compact = {
  format: "qiushi-graph-v1",
  canonicalNodeId: source.canonicalNodeId,
  stats: source.stats,
  types, layers, predicates, components,
  nodes: source.nodes.map((node) => [node.id, node.label, types.indexOf(node.entityType), node.degree, components.indexOf(node.componentId), node.componentSize]),
  edges: source.edges.map((edge) => {
    if (!nodeIndex.has(edge.source) || !nodeIndex.has(edge.target)) throw new Error("Missing edge endpoint");
    return [nodeIndex.get(edge.source), nodeIndex.get(edge.target), predicates.indexOf(edge.predicate), edge.layers.map((layer) => layers.indexOf(layer)), edge.rawStart, edge.rawEnd, (edge.evidenceLinkIds?.length || 0) + (edge.passageIds?.length || 0), edge.isSelfLoop ? 1 : 0];
  }),
};
const json = Buffer.from(JSON.stringify(compact));
const gzip = zlib.gzipSync(json, { level: 9 });
fs.writeFileSync(path.join(root, "assets/data/graph-runtime.json"), json);
fs.writeFileSync(path.join(root, "assets/data/graph-runtime.json.gz"), gzip);
console.log(`${source.nodes.length} nodes, ${source.edges.length} edges; JSON ${json.length} bytes; gzip ${gzip.length} bytes`);
