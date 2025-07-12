import puppeteer from "puppeteer-core";
import { Server } from "socket.io";
import { browserAction, userAction } from "./types";
import { getEnv, parseIntorFail } from "./utils";

export async function runBrowserAndWS(
  browserWidth: number,
  browserHeight: number
) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--kiosk",
      "--no-sandbox",
      `--window-size=${browserWidth - 20},${browserHeight}`, // intentional -20 on width for scrollbar
    ],
    ignoreDefaultArgs: ["--enable-automation"],
    executablePath: getEnv(
      "BROWSER_EXECUTABLE_PATH",
      "/usr/bin/chromium-browser"
    ),
    defaultViewport: { width: browserWidth - 20, height: browserHeight }, // intentional -20 on width for scrollbar
  });

  const pages = await browser.pages();
  const page = pages[0];

  const io = new Server({
    cors: { origin: getEnv("ALLOWED_CORS_ORIGINS", "*") },
  });

  const wsPort = parseIntorFail(getEnv("WS_PORT", "3000"), "WS_PORT");
  io.listen(wsPort);
  console.log("io server listening on port " + wsPort);

  io.on("connection", (socket) => {
    console.log("socket connection " + socket.id);

    socket.on("userAction", (arg: userAction["action"]) => {
      console.log("user action", arg);
      switch (arg?.kind) {
        case "page-reload":
          page.reload();
          break;
        case "page-navigation":
          page.goto(arg.url);
          break;
        case "page-back":
          page.goBack();
          break;
        case "page-forward":
          page.goForward();
          break;
        default:
          console.log("Unhandled user action " + arg);
      }
    });

    page.on("framenavigated", () => {
      const action: browserAction = {
        kind: "browserAction",
        action: { kind: "page-navigation", url: page.url() },
      };

      io.emit(action.kind, action);
      console.log("frame navigated..");
    });
  });

  page.on("close", () => {
    console.log("page closed");
    throw new Error("Page was closed");
  });
}
