import HtmlWebpackPlugin from 'html-webpack-plugin';

const entryScriptId = 'handmade-dev-server-script';

const getWebSocketScript = () => `
// Connect to WebSocket
var socket = new WebSocket('ws://localhost:3000/dev-server');

socket.onopen = function(event) {
  socket.send('Hello Server!');
};

socket.onmessage = function(event) {
  const message = JSON.parse(event.data);

  if (message.type === 'notice') {
    console.log(message.text);
  }

  if (message.type === 'modify') {
    console.log(message.text);
    const script = document.querySelector('#${entryScriptId}');

    if (script) {
      script.parentNode.removeChild(script);
      const newScript = document.createElement('script');
      newScript.src = 'main.js';
      newScript.id = '${entryScriptId}';
      document.head.appendChild(newScript);
    }
  }
};

socket.onclose = function(event) {
  console.log('Server: Connection Closed');
};

socket.onerror = function(error) {
  console.log('WebSocket Error: ' + error);
};
`;

class handmadeDevServerPlugin {
  constructor(options) {
    this.htmlWebpackPlugin = new HtmlWebpackPlugin(options);
  }

  apply(compiler) {
    this.htmlWebpackPlugin.apply(compiler);

    compiler.hooks.compilation.tap('handmadeDevServerPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        'handmadeDevServerPlugin',
        (data, cb) => {
          const wsScript = {
            attributes: {
              async: 'true',
              id: 'handmade-dev-server-web-socket',
            },
            meta: {},
            tagName: 'script',
            voidTag: false,
            innerHTML: getWebSocketScript(),
          };

          data.bodyTags.push(wsScript);

          data.headTags[0].attributes['id'] = entryScriptId;

          cb(null, data);
        }
      );
    });
  }
}

export default handmadeDevServerPlugin;
