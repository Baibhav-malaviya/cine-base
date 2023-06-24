import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Rating from "./Rating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <Rating maxRating={10} color={"gold"} size={40} />
    {/* <Rating
      maxRating={5}
      color={"gold"}
      size={80}
      message={["terrible", "bad", "okay", "good", "amazing"]}
      defaultRating={3}
    />
    <Rating
      color={"red"}
      size={30}
      message={["a", "b", "c", "d", "e"]}
      maxRating={12}
    /> */}
  </React.StrictMode>
);
