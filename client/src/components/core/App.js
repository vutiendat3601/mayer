import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

// core styles
import "../../styles/volt.scss";

import Home from "../view/Home";
import ScrollToTop from "./Scroll/ScrollToTop";
import store from "../../store";

function App(props) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <Home />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
