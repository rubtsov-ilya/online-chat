import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import App from './app/App.tsx';
import './app/index.scss';
import { store, persistor } from './redux/index.ts';

import { Provider } from 'react-redux';
import './firebase.ts';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>,
);
