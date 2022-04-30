import fs from "fs";
import CsvReadableStream from "csv-reader";
import Graph from "graphology";
import { renderToPNG } from "graphology-canvas/node.js";
import { random } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";
import louvain from "graphology-communities-louvain";

async function resolveNodes(graph) {
  await new Promise((resolve) => {
    const nodesInputStream = fs.createReadStream(
      "/Users/edgarask/sites/vilniustech/microservice-extraction/graph-model-builder/outputs/auction-api-nodes.csv",
      "utf8"
    );
    nodesInputStream
      .pipe(
        new CsvReadableStream({
          parseNumbers: true,
          parseBooleans: true,
          trim: true,
          skipHeader: true,
        })
      )
      .on("data", function ([id]) {
        console.log(`Add node ${id}...`);
        graph.addNode(id);
      })
      .on("end", function () {
        console.log("Finished parsing nodes...");
        resolve();
      });
  });
}

async function resolveEdges(graph) {
  await new Promise((resolve) => {
    const edgesInputStream = fs.createReadStream(
      "/Users/edgarask/sites/vilniustech/microservice-extraction/graph-model-builder/outputs/auction-api-edges.csv",
      "utf8"
    );
    edgesInputStream
      .pipe(
        new CsvReadableStream({
          parseNumbers: true,
          parseBooleans: true,
          trim: true,
          skipHeader: true,
        })
      )
      .on("data", function ([source, target, weight]) {
        console.log(`Add edge ${source} -> ${target} : ${weight}`);
        graph.addEdge(source, target, {
          weight,
        });
      })
      .on("end", function () {
        console.log("Finished parsing edges...");
        resolve();
      });
  });
}

async function main() {
  const graph = new Graph.DirectedGraph();

  await resolveNodes(graph);
  await resolveEdges(graph);

  louvain.assign(graph, {
    getEdgeWeight: "weight",
  });

  const communities = louvain(graph, {
    getEdgeWeight: "weight",
  });

  console.debug(communities);

  random.assign(graph);

  // To directly assign the positions to the nodes:
  forceAtlas2.assign(graph, {
    iterations: 10,
    settings: {
      gravity: 1,
    },
  });

  renderToPNG(
    graph,
    "./graph.png",
    {
      width: 300,
      height: 300,
      padding: 5,
      nodes: {
        reducer: (settings, node, attr) => ({
          type: attr.type || "circle",
          label: "hello",
          x: attr.x,
          y: attr.y,
          size: 1,
          color: "#cb4b16",
        }),
      },
    },
    () => console.log("Done!")
  );
}

main();
