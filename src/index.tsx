import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

fetch("http://localhost:3000/api/hello", {
  headers: {
    'content-type': 'json',
  },
  mode: 'cors',
}).then(res => {
  console.log(res);
  return res.json()
}).then(res=> {
  console.log(res);
})

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
