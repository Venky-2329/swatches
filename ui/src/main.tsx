import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import { ConfigProvider, theme } from 'antd';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ConfigProvider
    locale={{ locale: 'en-US' }}
    theme={{
      algorithm: theme.compactAlgorithm,
      token: {
        colorPrimary: '#22C55E',
        borderRadius: 5,
        
      },
    }}
  >
    <App />
  </ConfigProvider >
);
