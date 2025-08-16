import puppeteer, { LaunchOptions } from "puppeteer-core";
import { Server } from "socket.io";
import { browserAction, userAction } from "./types";
import {
  getEnv,
  parseIntorFail,
  getEmptyPageContent,
  getNavigatingPageContent,
} from "./utils";
import express, { json } from "express";
import Joi from "joi";
import cors from "cors";

export async function runBrowserAndServer(
  browserWidth: number,
  browserHeight: number,
  mode: "http" | "websockets"
) {
  const launchOptions: LaunchOptions = {
    headless: false,
    args: ["--no-sandbox", "--kiosk"],
    ignoreDefaultArgs: ["--enable-automation"],
    executablePath: getEnv(
      "BROWSER_EXECUTABLE_PATH",
      "/usr/bin/chromium-browser"
    ),
  };

  if (process.env.ENVIRONMENT !== "development") {
    launchOptions.args ??= [];
    launchOptions.args.push(
      `--window-size=${browserWidth - 20},${browserHeight}` // intentional -20 on width for scrollbar
    );
    launchOptions.defaultViewport = {
      width: browserWidth - 20,
      height: browserHeight,
    };
  }

  const browser = await puppeteer.launch(launchOptions);

  const pages = await browser.pages();
  const page = pages[0];

  await page.setContent(getEmptyPageContent());

  const port = parseIntorFail(getEnv("PORT", "3000"), "PORT");

  if (mode === "websockets") {
    const io = new Server({
      cors: { origin: getEnv("ALLOWED_CORS_ORIGINS", "*") },
    });

    io.on("connection", (socket) => {
      console.log("socket connection " + socket.id);

      socket.on("ping", () => {
        socket.emit("pong");
      });

      socket.on("userAction", (arg: userAction["action"]) => {
        console.log("user action", arg);
        switch (arg?.kind) {
          case "page-reload":
            page.reload();
            break;
          case "page-navigate":
            page.setContent(getNavigatingPageContent(arg.url)).then(() => {
              page
                .goto(arg.url)
                .catch((err) => console.log("Failed to navigate to url", err));
            });
            break;
          case "page-goback":
            page.goBack().then(() => {
              if (page.url() === "about:blank") {
                page.setContent(getEmptyPageContent());
              }
            });
            break;
          case "page-goforward":
            page.goForward();
            break;
          case "page-reset":
            page.goto("about:blank").then(() => {
              page.setContent(getEmptyPageContent());
            });
            break;
          default:
            console.log("Unhandled user action " + arg);
        }
      });

      page.on("framenavigated", () => {
        const action: browserAction = {
          kind: "browserAction",
          action: { kind: "page-navigate", url: page.url() },
        };

        io.emit(action.kind, action);
        console.log("frame navigated..");
      });
    });

    io.listen(port);
    console.log(`IO Server on port ${port} [mode=${mode}]`);
  } else {
    const app = express();

    app.get("/", (req, res) => {
      res.sendStatus(200);
    });

    app.get("/healthz", (req, res) => {
      res.send("OK");
    });

    app.post(
      "/action",
      cors({ origin: getEnv("ALLOWED_CORS_ORIGINS", "*") }),
      json(),
      async (req, res) => {
        const schema = Joi.object<userAction["action"]>({
          kind: Joi.string()
            .required()
            .valid(
              "page-reload",
              "page-navigate",
              "page-goback",
              "page-goforward",
              "page-reset"
            ),
          url: Joi.string().uri().when("kind", {
            is: "page-navigate",
            then: Joi.required(),
            otherwise: Joi.forbidden(),
          }),
        }).required();

        const { error, value: fields } = schema.validate(req.body);
        if (error) {
          return res.status(400).json({ success: false, error: error });
        }

        console.log("user action", fields);

        switch (fields.kind) {
          case "page-reload":
            page.reload();
            res.sendStatus(202);
            return;
          case "page-navigate":
            page.setContent(getNavigatingPageContent(fields.url)).then(() => {
              page
                .goto(fields.url)
                .catch((err) => console.log("Failed to navigate to url", err));
            });
            res.sendStatus(202);
            return;
          case "page-goback":
            page.goBack().then(() => {
              if (page.url() === "about:blank") {
                page.setContent(getEmptyPageContent());
              }
            });
            res.sendStatus(202);
            return;
          case "page-goforward":
            page.goForward();
            res.sendStatus(202);
            return;
          case "page-reset":
            page.goto("about:blank").then(() => {
              page.setContent(getEmptyPageContent());
            });
            res.sendStatus(202);
            return;
          default:
            console.log("Unhandled user action " + fields);
            res.sendStatus(500);
        }
      }
    );

    app.listen(port);
    console.log(`Server listening on port ${port} [mode=${mode}]`);
  }

  page.on("close", () => {
    console.log("page closed");
    throw new Error("Page was closed");
  });
}
