import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.js";
import { ChatProvider } from "./Context/ChatProvider";
import reportWebVitals from "./reportWebVitals";
import store from "./store/index";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router>
      <SnackbarProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </SnackbarProvider>
    </Router>
  </Provider>
);

reportWebVitals();
