console.log("builder.js is working!");

var hasChildren = (target) => {
  if (target.tagName === "SLOT")  return true;
  if (target.shadowRoot)          return true;
                                  return (!!target.children.length);
}

var getChildren = (target) => {
  if (target.tagName === "SLOT")  return Array.from(target.assignedNodes());
  if (target.shadowRoot)          return Array.from(target.shadowRoot.children);
                                  return Array.from(target.children);
}

var isCustomElement = (tagName) => {
  // TODO: Figure out the actual api for determining custom elements
  //       throw an error if an unregistered one is encountered
  return (tagName.indexOf('-') !== -1);
}

function analyzeLayer(target) {
  localQueue = getChildren(target);

  while (localQueue.length > 0) {
    item = localQueue.shift();
    if (isCustomElement(item.tagName)) {
      // Vertex
      if (vertices.indexOf(item) === -1) {
        vertices.push(item);
      }

      // Edge
      edges.push(
        [ vertices.indexOf(item), vertices.indexOf(item.parentElement) ]
      );
    }

    // Data
    if (item.__data) {
      componentData[vertices.indexOf(item)] = item.__data;
    }

    if (hasChildren(item)) {
      queue.push(item);
    }
  }
}

var vertices, edges, componentData, queue;

var buildCustomElementGraph = () => {
  vertices = [document.body];
  edges = [];
  componentData = {};
  queue = [document.body];

  while (queue.length > 0) {
    analyzeLayer(queue.shift());
  }

  return true;
}

window.buildCustomElementGraph = buildCustomElementGraph;

buildCustomElementGraph();
