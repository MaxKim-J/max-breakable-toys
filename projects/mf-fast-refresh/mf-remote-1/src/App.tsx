import { Content } from './Content';

function App() {
  return <Content />;
}

export default App;

if ((module as any).hot) {
  console.info('???된거맞나');

  (module as any).hot.accept('./Content', () => {
    console.info('변경되었는디요..');
  });
}
