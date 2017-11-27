var panels = chrome && chrome.devtools && chrome.devtools.panels;
var elementsPanel = panels && panels.elements;

if (panels) {
  panels.create('WC Visualizer', 'img/web_components.png', 'src/panel.html');
}

// var toEval = JsonifyWindow.toString() + "; var jw = new JsonifyWindow(document); jw.run();"
// console.log(toEval);

var toEval = "document.body.children.length;"

chrome.devtools.inspectedWindow.eval(
  toEval,
  function(result, isException) {
    console.log("exception?", isException);
    console.log("result", result);
  }
)
