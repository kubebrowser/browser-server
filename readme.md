# browser-server

Runs remote controllable chromium browser with puppeteer and opens a VNC port.

Browser can be controlled either via `http` requests or `websocket` messages.

| Environment Variable    | Description                | Default                   |
| ----------------------- | -------------------------- | ------------------------- |
| BROWSER_WIDTH           | browser width              | 1920                      |
| BROWSER_HEIGHT          | browser height             | 1080                      |
| BROWSER_DEPTH           | browser depth              | 24                        |
| MODE                    | What kind of server to run | http                      |
| BROWSER_EXECUTABLE_PATH | browser executable path    | /usr/bin/chromium-browser |
| PORT                    | what port to listen on     | 3000                      |
| ALLOWED_CORS_ORIGINS    | allowed cors origins       | \*                        |
