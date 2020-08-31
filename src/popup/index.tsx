/**
 * This is the entry point for the
 * extension
 */
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <div>
    <h1>Image Begone</h1>

    <label>
      <input type="checkbox" checked /> Spiders
    </label>
    
    <div>
      Icons made by{" "}
      <a
        href="https://www.flaticon.com/authors/pixel-perfect"
        title="Pixel perfect"
      >
        Pixel perfect
      </a>{" "}
      from{" "}
      <a href="https://www.flaticon.com/" title="Flaticon">
        www.flaticon.com
      </a>
    </div>
  </div>,
  document.getElementById("root")
);
