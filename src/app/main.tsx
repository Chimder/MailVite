import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles/index.css'

import Providers from './providers/providers'
import Routes from './router/router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Providers>
    <Routes />
  </Providers>,
  // </React.StrictMode>,
)
