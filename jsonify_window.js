class JsonifyWindow {

  // tagName
  // id
  // attributes
  constructor(document) {
    this.vertices = [document.body];
    this.edges = [];
    this.state = {};
    this.properties = {};
    this.queue = [document.body];
  }

  run() {
    while (this.queue.length > 0) {
      var target = this.queue.shift();
      if (target) this.analyzeLayer(target);
    }

    var view = {
      vertices: this.vertices,
      edges: this.edges,
      state: this.state,
      properties: this.properties
    };

    return view;
  };

  analyzeLayer(target) {
    var localQueue = this.getChildren(target);

    while (localQueue.length > 0) {
      item = localQueue.shift();
      if (this.isCustomElement(item.tagName)) {
        if (this.vertices.indexOf(item) === -1) {
          this.vertices.push(item.toJson());
        }
        this.edges.push(
          [ this.vertices.indexOf(item), this.vertices.indexOf(item.parentElement) ]
        );
      }
      if (this.hasChildren(item)) {
        this.queue.push(item);
      }
    }
  }

  getChildren(target) {
    if (target.tagName === "SLOT")  return Array.from(target.assignedNodes());
    if (target.shadowRoot)          return Array.from(target.shadowRoot.children);
                                    return Array.from(!!target.children.length);
  }

  isCustomElement(tagName) {
    // TODO: Figure out the actual api for determining custom elements
    //       throw an error if an unregistered one is encountered
    if (!!tagName) {
      return (tagName.indexOf('-') !== -1);
    }
  }

  hasChildren(target) {
    if (target.tagName === "SLOT")  return true;
    if (target.shadowRoot)          return true;
    if ('children' in target) {
      return !!target.children.length;
    } else {
      return false;
    }
  }
}
