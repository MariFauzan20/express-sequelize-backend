const express = require("express");
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const dotenv = require("dotenv");

const app = express();
const port = 3000;

app.use(express.json());
dotenv.config();

const sequelize = new Sequelize(`${process.env.DATABASE_URL}`);

async function checkConnection() {
  await sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .then(() => {
      hewan.sync().then(() => console.log("table hewan created"));
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
}

checkConnection();

const hewan = sequelize.define(
  "hewan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    nama: { type: DataTypes.STRING, allowNull: false },
    namaSpesies: { type: DataTypes.STRING, allowNull: false },
    umur: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    createdAt: true,
    updatedAt: true,
  }
);

app.get("/hewan", (req, res) => {
  hewan
    .findAll()
    .then((result) => {
      res.json({
        message: "OK",
        data: result,
      });
    })
    .catch((error) => {
      res.send({
        message: error,
      });
    });
});

app.get("/hewan/:id", (req, res) => {
  const hewanId = req.params.id;

  hewan
    .findOne({ where: { id: hewanId } })
    .then((result) => {
      res.json({
        message: "OK",
        data: result,
      });
    })
    .catch((error) => {
      res.send({
        message: error,
      });
    });
});

app.post("/hewan", async (req, res) => {
  const body = req.body;
  const dataHewan = {
    id: body["id"],
    nama: body["nama"],
    namaSpesies: body["namaSpesies"],
    umur: body["umur"],
  };

  try {
    await hewan.create(dataHewan);
    res.status(201).send({ message: "success", data: dataHewan });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

app.patch("/hewan/:id", async (req, res) => {
  try {
    const hewanId = req.params.id;
    const body = req.body;
    const dataHewan = {
      nama: body["nama"],
      namaSpesies: body["namaSpesies"],
      umur: body["umur"],
    };
    await hewan.update(dataHewan, { where: { id: hewanId } });
    res.status(200).json({
      message: "Updated",
      data: dataHewan,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

app.delete("/hewan/:id", async (req, res) => {
  try {
    const hewanId = req.params.id;

    await hewan.destroy({ where: { id: hewanId } });
    res.status(200).json({
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
