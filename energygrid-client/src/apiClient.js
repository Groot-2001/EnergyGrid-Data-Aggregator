const crypto = require("crypto");
const http = require("http");

const API_URL = "http://localhost:3000/device/real/query";
const TOKEN = "interview_token_123";

function generateSignature(url, timestamp) {
  return crypto
    .createHash("md5")
    .update(url + TOKEN + timestamp)
    .digest("hex");
}

function postBatch(snList) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now().toString();
    const signature = generateSignature("/device/real/query", timestamp);

    const body = JSON.stringify({ sn_list: snList });

    const req = http.request(
      API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          "timestamp": timestamp,
          "signature": signature
        }
      },
      (res) => {
        let data = "";

        res.on("data", chunk => (data += chunk));
        res.on("end", () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject({ status: res.statusCode, body: data });
          }
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

module.exports = { postBatch };
