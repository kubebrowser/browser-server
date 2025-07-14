// @ts-ignore
import Xvfb from "xvfb";
import { checkEvironment, getEnv, parseIntorFail } from "./utils";
import { runBrowserAndServer } from "./browser";

async function main() {
  checkEvironment();

  const browserWidth = parseIntorFail(
    getEnv("BROWSER_WIDTH", "1920"),
    "BROWSER_WIDTH"
  );

  const browserHeight = parseIntorFail(
    getEnv("BROWSER_HEIGHT", "1080"),
    "BROWSER_HEIGHT"
  );

  const browserDepth = parseIntorFail(
    getEnv("BROWSER_DEPTH", "24"),
    "BROWSER_DEPTH"
  );

  const xvfb = new Xvfb({
    displayNum: 99,
    xvfb_args: [
      "-screen",
      "0",
      `${browserWidth}x${browserHeight}x${browserDepth}`,
    ],
    reuse: true,
  });

  const xvfbProcess = xvfb.startSync();
  console.log("started xvfb process: " + xvfbProcess.pid);
  try {
    await runBrowserAndServer(
      browserWidth,
      browserHeight,
      getEnv("MODE", "http") as "http" | "websockets"
    );
  } catch (err) {
    console.log(err);
    xvfb.stopSync();
  }
}

main().catch(console.log);
