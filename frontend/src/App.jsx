import "./App.css";
import MainForm from "./form.jsx";
import { Provider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: '247fe011eda945aab56eb7d8e187f4fc',
  environment: 'testenv',
};

function TestError() {
  const a = null;
  return a.hello();
}

function App () {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
      <MainForm />
    </Provider>
  );
}

export default App;
