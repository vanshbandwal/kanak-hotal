import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmationProvider } from './context/ConfirmationContext';
import ToastContainer from './components/Toast/ToastContainer';
import MainNavigator from './navigation/Markup';
import './index.css';

import ErrorBoundary from './components/Common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <ConfirmationProvider>
            <ToastProvider>
              <Router>
                <MainNavigator />
              </Router>
              <ToastContainer />
            </ToastProvider>
          </ConfirmationProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
