import { GlobalProvider } from './contexts/GlobalContext';
import { GlobalDataProvider } from './contexts/GlobalDataContext';
import App from './containers/App/App';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function Boot() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ReduxProvider store={store}>
        <GlobalProvider>
          <GlobalDataProvider>
            <App />
          </GlobalDataProvider>
        </GlobalProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
}

export default Boot;
