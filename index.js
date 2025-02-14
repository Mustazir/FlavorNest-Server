const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w81iv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("FlavourNestDB").collection("menu");
    const reviewCollection = client.db("FlavourNestDB").collection("reviews");

    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    app.get("/menucount", async (req, res) => {
      const count = await menuCollection.estimatedDocumentCount();
      res.send({ count });
    });

    //   app.get('/menuProductCount', async (req, res) => {
    //     try {
    //         const categoryCounts = await menuCollection.aggregate([
    //             {
    //                 $group: {
    //                     _id: "$category", // ক্যাটেগরি অনুসারে গ্রুপ করা
    //                     count: { $sum: 1 } // প্রতিটি ক্যাটেগরির পণ্য সংখ্যা গোনা
    //                 }
    //             }
    //         ]).toArray();

    //         res.send(categoryCounts);
    //     } catch (error) {
    //         console.error("Error fetching menu count:", error);
    //         res.status(500).send({ error: "Internal Server Error" });
    //     }
    // });

    app.get("/menucount/:category", async (req, res) => {
      try {
        const category = req.params.category;
        const count = await menuCollection.countDocuments({
          category: category,
        });
        res.send({ count });
      } catch (error) {
        console.error("Error fetching category count:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FlavourNest is Running");
});

app.listen(port, () => {
  console.log(`FlavourNest Is running on port  ${port}`);
});
