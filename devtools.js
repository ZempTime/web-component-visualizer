var panels = chrome && chrome.devtools && chrome.devtools.panels;
var elementsPanel = panels && panels.elements;

if (panels) {
  panels.create('WC Visualizer', 'img/web_components.png', 'src/panel.html');
}

var toEval = `var jsonifyWindow = ${jsonifyWindow.toString()}; jsonifyWindow(document);`;
console.log(toEval);

chrome.devtools.inspectedWindow.eval(
  toEval,
  function(result, isException) {
    console.log("exception?", isException);
    console.log("result", result);
  }
)
