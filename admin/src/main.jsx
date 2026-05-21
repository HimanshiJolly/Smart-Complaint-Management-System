import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from './App.jsx';
import AdminLogin from "./pages/AdminLogin";

import './main.css';
import './App.css';

ReactDOM.createRoot(
  document.getElementById('root')
).render(

  <React.StrictMode>

    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<AdminLogin />}
        />

        <Route
          path="/"
          element={<App />}
        />

      </Routes>

    </BrowserRouter>

  </React.StrictMode>
);