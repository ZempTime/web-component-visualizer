var panels = chrome && chrome.devtools && chrome.devtools.panels;
var elementsPanel = panels && panels.elements;

if (panels) {
  panels.create('WC Visualizer', 'img/web_components.png', 'src/panel.html');
}

var toEval = `
  var jsonifyWindow = ${jsonifyWindow.toString()};
  var decycle = ${decycle.toString()};
  var result = jsonifyWindow(document);
  result = decycle(result);
  JSON.parse(JSON.stringify(result));
  `;

chrome.devtools.inspectedWindow.eval(
  toEval,
  function(result, isException) {
    console.log("exception?", isException);
    console.log("result", result);
    document.getElementById("result").innerHtml = result.toString();
  }
)
