import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';

const rootNode = document.getElementById('root');
const root = ReactDOM.createRoot(rootNode);

const render = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

render();

if ((module as any).hot) {
  (module as any).hot.accept('./src/App', () => render());
}
