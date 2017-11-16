var panels = chrome && chrome.devtools && chrome.devtools.panels;
var elementsPanel = panels && panels.elements;

if (panels) {
  panels.create('WC Visualizer', 'img/web_components.png', 'src/index.html');
}
