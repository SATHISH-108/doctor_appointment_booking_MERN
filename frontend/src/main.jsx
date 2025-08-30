import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./features/store.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <div className="mx-4 sm:mx-[10%]">
        <ToastContainer position="top-right" autoClose={1000} />
        <App />
      </div>
    </Provider>
    {/* or */}
    {/* <Provider store={store}>
        <App />
    </Provider> */}
  </StrictMode>
);
