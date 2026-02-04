const { fetchAllDevices } = require("./aggregator");

function generateSerialNumbers() {
  return Array.from({ length: 500 }, (_, i) =>
    `SN-${i.toString().padStart(3, "0")}`
  );
}

(async () => {
  try {
    const serialNumbers = generateSerialNumbers();
    const results = await fetchAllDevices(serialNumbers);

    console.log("Aggregation complete");
    console.log(`Total devices fetched: ${results.length}`);
  } catch (err) {
    console.error("Failed:", err.message);
  }
})();
