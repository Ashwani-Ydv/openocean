import React from "react";
import ReactDOM from "react-dom";

import "./App.css";
import Color from "./components/Colors";

const App = () => {
  return (
    <div className="app">
      <Color />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
