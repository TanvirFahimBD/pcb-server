require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kgjk6dy.mongodb.net`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("pcDb");
    const pcCollection = db.collection("pc");

    app.get("/pcparts", async (req, res) => {
      const cursor = pcCollection.find({});
      const pcs = await cursor.toArray();
      res.send({ status: true, data: pcs });
    });

    app.get("/pcparts/featured", async (req, res) => {
      const result = await pcCollection.find({ featured: true }).toArray();
      res.send(result);
    });

    app.get("/pcparts/:id", async (req, res) => {
      const id = req.params.id;
      const result = await pcCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.get("/pcparts/category/:categoryName", async (req, res) => {
      const categoryName = req.params.categoryName;
      const result = await pcCollection
        .find({ category: categoryName })
        .toArray();
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("PC Server Live!");
});

app.listen(port, () => {
  console.log(`PC Server listening on port ${port}`);
});
