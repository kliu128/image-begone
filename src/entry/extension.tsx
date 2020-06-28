/**
 * This is the entry point for the
 * extension
 */
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<div>hi!</div>, document.getElementById("root"));
console.log("myah");
function webgl_support() {
  try {
    var canvas = document.createElement("canvas");
    return (
      !!window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}
console.log(webgl_support());
