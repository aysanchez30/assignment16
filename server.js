const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
const animals = [
{
    _id: 1,
    name: "Lion",
    color: "Brown",
    size: "8-9ft long",
    located: ["Africa, India"],
    diet: "Carnivore",
    image: "images/lion.avif "
},
{
    _id: 2,
    name: "Penguin",
    color: "Black and White",
    size: "3-4ft",
    located: ["Antarctica", "Southern Hemisphere"],
    diet: "Carnivore",
    image: "images/penguin.jpeg",
},
{
    _id: 3,
    name: "Dolphin",
    color: "Gray",
    size: "6-7ft",
    located: ["Oceans worldwide"],
    diet: "Carnivore",
    image: "images/dolphin.jpeg",
},
{
    _id: 4,
    name: "Elephant",
    color: "Gray",
    size: "Up to 13ft tall",
    located: ["Africa", "Asia"],
    diet: "Herbivore",
    image: "images/elephant.jpeg",
},
{
    _id: 5,
    name: "Koala",
    color: "Gray",
    size: "About 2 feet tall",
    located: "Australia",
    diet: "Herbivore",
    image: "images/koala.jpeg",
  },
  {
    _id: 6,
    name: "Clownfish",
    color: "Orange with black and white stripes",
    size: "Up to 4 inches",
    located: ["Coral reefs in the Pacific and Indian Oceans"],
    diet: "Omnivore",
    image: "images/clownfish.jpeg",
  }
];

app.get("/api/animals", (req, res) => {
    res.send(animals);
});

app.post("/api/animals", upload.single("img"), (req, res) => {
    const result = validateAnimal(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const animal = {
        _id: animals.length + 1,
        name: req.body.name,
        color: req.body.color,
        size: req.body.size,
        located: req.body.located.split(","),
        diet: req.body.diet
    }

    if (req.file) {
        animal.img = "images/" + req.file.filename;
    }

    animals.push(animal);
    res.send(animals);
});

app.put("/api/animals/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const animal = animals.find((r) => r._id === id);;

    const result = validateAnimal(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    animal.name = req.body.name;
    animal.color = req.body.color;
    animal.size = req.body.size;
    animal.located = req.body.located.split(",");;
    animal.diet = req.body.diet;

    if (req.file) {
        animal.img = "images/" + req.file.filename;
    }

    res.send(animal);
});

app.delete("/api/animals/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const animal = animals.find((r) => r._id === id);

    if (!animal) {
        res.status(404).send("The animal was not found");
        return;
    }

    const index = animals.indexOf(animal);
    animals.splice(index, 1);
    res.send(animal);

});

const validateAnimal = (animal) => {
    const schema = Joi.object({
        _id: Joi.number().allow(''),
        name: Joi.string().allow(''),
        color: Joi.string().min(3).required(),
        size: Joi.string().min(3).required(),
        located: Joi.string().min(3).required(),
        diet: Joi.string().min(3).required()
    });

    return schema.validate(animal);
};

app.listen(3000, () => {
    console.log("I'm listening");
});