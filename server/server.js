const path = require("path");
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

// console.log(__dirname + "../public");
// console.log(publicPath);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
