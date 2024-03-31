import HtmlWebpackPlugin from 'html-webpack-plugin';

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
    const script = document.querySelector('#handmade-dev-server-script');
    console.info(script);

    if (script) {
      script.parentNode.removeChild(script);
      const newScript = document.createElement('script');
      newScript.src = 'main.js';
      newScript.id = 'handmade-dev-server-script';
      document.head.appendChild(newScript);
    }
  }
  // 수정되었을때 뭔갈 하는 코드(새로고침이라던지, rrf연동이라던지)
  // replace하기

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

          data.headTags[0].attributes['id'] = 'handmade-dev-server-script';

          cb(null, data);
        }
      );
    });
  }
}

export default handmadeDevServerPlugin;
