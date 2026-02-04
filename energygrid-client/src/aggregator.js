const { postBatch } = require("./apiClient");
const RateLimiter = require("./rateLimiter");

const limiter = new RateLimiter(1000);
const MAX_RETRIES = 3;

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function fetchAllDevices(serialNumbers) {
  const batches = chunkArray(serialNumbers, 10);
  const aggregatedResults = [];

  for (let i = 0; i < batches.length; i++) {
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        await limiter.wait();
        console.log(`Fetching batch ${i + 1}/${batches.length}`);
        const response = await postBatch(batches[i]);
        aggregatedResults.push(...response.data);
        break;
      } catch (err) {
        attempt++;
        console.error(
          `Batch ${i + 1} failed (attempt ${attempt})`,
          err.status || err
        );

        if (attempt === MAX_RETRIES) {
          throw new Error("Max retries exceeded");
        }

        // backoff
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }

  return aggregatedResults;
}

module.exports = { fetchAllDevices };
