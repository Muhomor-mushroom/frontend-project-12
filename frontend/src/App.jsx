import "./App.css";
import MainForm from "./form.jsx";
import { Provider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: '247fe011eda945aab56eb7d8e187f4fc',
  environment: 'testenv',
};

function App () {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
      </ErrorBoundary>
      <MainForm />
    </Provider>
  );
}

export default App;
