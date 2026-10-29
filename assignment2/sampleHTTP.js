const http = require("http");

const server = http.createServer((req, res) => {
  // GET /time - Return the current time as JSON
  if (req.method === "GET" && req.url === "/time") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ time: new Date().toString() }));

  // GET /timePage - Display a page with a button to get the time
  } else if (req.method === "GET" && req.url === "/timePage") {
    const htmlString = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Clock</title>
      </head>
      <body>
        <h1>Clock</h1>
        <button id="getTimeBtn">Get the Time</button>
        <p id="time"></p>

        <script>
          document.getElementById('getTimeBtn').addEventListener('click', async () => {
            const res = await fetch('/time');
            const timeObj = await res.json();
            console.log(timeObj);

            const timeP = document.getElementById('time');
            timeP.textContent = timeObj.time;
          });
        </script>
      </body>
      </html>
    `;

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
    });
    res.end(htmlString);

  // POST /echo - Return the JSON body sent by the client
  } else if (req.method === "POST" && req.url === "/echo") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const parsedBody = JSON.parse(body);

        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({ weReceived: parsedBody }));
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
          message: "Invalid JSON."
        }));
      }
    });

  // Handle routes that do not exist
  } else {
    res.writeHead(404, {
      "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
      message: "That route is not available."
    }));
  }
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
