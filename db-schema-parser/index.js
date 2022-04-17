const parseAuctionApiSchema = require("./impl/auction-api");

parseAuctionApiSchema()
  .then(() => {
    console.warn("done");
  })
  .catch((error) => {
    console.warn("fail", error);
  });
