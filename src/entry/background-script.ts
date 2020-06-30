import "webextension-polyfill";

import * as tf from "@tensorflow/tfjs";
import { loadGraphModel } from "@tensorflow/tfjs-converter";

console.log(tf, loadGraphModel);
