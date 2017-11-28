var jsonifyWindow = (document) => {
  var __vertices = [document.body];
  var serializedVertices = [];
  var edges = [];
  var queue = [document.body];

  const getChildren = (target) => {
    if (target.tagName === "SLOT")  return Array.from(target.assignedNodes());
    if (target.shadowRoot)          return Array.from(target.shadowRoot.children);
                                    return Array.from(target.children);
  }

  const isCustomElement = (element) => {
    return element instanceof Polymer.Element;
  }

  const hasChildren = (target) => {
    if (target.tagName === "SLOT")  return true;
    if (target.shadowRoot)          return true;
    if ('children' in target) {
      return !!target.children.length;
    } else {
      return false;
    }
  }

  const serializeState = (target) => {
    var serialized = {};
    var object = target.__data;

    Object.keys(object).forEach((item) => {
      var name = item;
      var value = object[item];
      if (typeof value === "function") return;
      if (name === "__proto__") return;
      serialized[name] = value;
    });

    return serialized;
  }

  const serializeAttributes = (target) => {
    var serialized = {};
    var object = target.attributes;

    Object.keys(object).forEach((item) => {
      var name = object[item].name;
      var value = object[item].value;
      if (typeof value === "function") return;
      if (name === "__proto__") return;
      serialized[name] = value;
    });

    return serialized;
  }

  const serializeElement = (target) => {
    return {
      tagName: target.tagName.toLowerCase(),
      attributes: serializeAttributes(target),
      state: serializeState(target),
      // properties: target.__proto__.constructor.__classProperties,
    }
  }

  const analyzeLayer = (target) => {
    var localQueue = getChildren(target);

    while (localQueue.length > 0) {
      var item = localQueue.shift();
      if (isCustomElement(item)) {
        if (__vertices.indexOf(item) === -1) {
          __vertices.push(item);
          serializedVertices.push(serializeElement(item))
        }
        edges.push(
          [ __vertices.indexOf(item), __vertices.indexOf(item.parentElement) ]
        );
      }
      if (hasChildren(item)) {
        queue.push(item);
      }
    }
  }

  while (queue.length > 0) {
    var target = queue.shift();
    if (target) analyzeLayer(target);
  }

  var view = {
    vertices: serializedVertices,
    edges: edges
  };

  return view;
}
