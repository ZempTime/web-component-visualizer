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

  const serializeProperties = (target) => {
    // TODO: Pull in more of the property definitions
    return Object.keys(target.__proto__.constructor.__classProperties);
  }

  const serializeState = (target) => {
    var serialized = {};
    var propertyKeys = Object.keys(target.__proto__.constructor.__classProperties);
    var object = target.__data;

    serializeProperties(target).forEach((item) => {
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
      properties: serializeProperties(target),
      attributes: serializeAttributes(target),
      state: serializeState(target),
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

// Loaded from: https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
var decycle = (object, replacer) => {
    "use strict";
    var objects = new WeakMap();     // object to path mappings

    return (function derez(value, path) {

        var old_path;   // The path of an earlier occurance of value
        var nu;         // The new object or array

        if (replacer !== undefined) {
            value = replacer(value);
        }

        if (
            typeof value === "object" && value !== null &&
            !(value instanceof Boolean) &&
            !(value instanceof Date) &&
            !(value instanceof Number) &&
            !(value instanceof RegExp) &&
            !(value instanceof String)
        ) {

            old_path = objects.get(value);
            if (old_path !== undefined) {
                return {$ref: old_path};
            }

            objects.set(value, path);

            if (Array.isArray(value)) {
                nu = [];
                value.forEach(function (element, i) {
                    nu[i] = derez(element, path + "[" + i + "]");
                });
            } else {

                nu = {};
                Object.keys(value).forEach(function (name) {
                    nu[name] = derez(
                        value[name],
                        path + "[" + JSON.stringify(name) + "]"
                    );
                });
            }
            return nu;
        }
        return value;
    }(object, "$"));
};


if (typeof JSON.retrocycle !== "function") {
    JSON.retrocycle = function retrocycle($) {
        "use strict";

        var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\([\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

        (function rez(value) {

            if (value && typeof value === "object") {
                if (Array.isArray(value)) {
                    value.forEach(function (element, i) {
                        if (typeof element === "object" && element !== null) {
                            var path = element.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[i] = eval(path);
                            } else {
                                rez(element);
                            }
                        }
                    });
                } else {
                    Object.keys(value).forEach(function (name) {
                        var item = value[name];
                        if (typeof item === "object" && item !== null) {
                            var path = item.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[name] = eval(path);
                            } else {
                                rez(item);
                            }
                        }
                    });
                }
            }
        }($));
        return $;
    };
}
