const getAnimals = async() => {
    try {
        return (await fetch("api/animals/")).json();
    } catch (error) {
        console.log(error);
    }
};

const showAnimals = async() => {
    let animals = await getAnimals();
    let animalsDiv = document.getElementById("animal-list");
    animalsDiv.innerHTML = "";
    animals.forEach((animal) => {
        const section = document.createElement("section");
        section.classList.add("animal");
        animalsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = animal.name;
        a.append(h3);

        const img = document.createElement("img");
        img.src = animal.img;
        section.append(img);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(animal);
        };
    });
};

const displayDetails = (animal) => {
    const animalDetails = document.getElementById("animal-details");
    animalDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = animal.name;
    animalDetails.append(h3);

    const detailsList = document.createElement("ul");
    animalDetails.append(detailsList);

    const addDetail = (label, value) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${label}:</strong> ${value}`;
        detailsList.append(li);
    };

    addDetail("Color", animal.color);
    addDetail("Size", animal.size);
    addDetail("Located", animal.located.join(", "));
    addDetail("Diet", animal.diet);

    const img = document.createElement("img");
    img.src = animal.img;
    animalDetails.append(img);

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit-title").innerHTML = "Edit Animal";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
        deleteAnimal(animal);
    };

    populateEditForm(animal);
};

const deleteAnimal = async(animal) => {
    let response = await fetch(`/api/animals/${animal._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    if (response.status != 200) {
        console.log("error deleting");
        return;
    }

    let result = await response.json();
    showAnimals();
    document.getElementById("animal-details").innerHTML = "";
    resetForm();
}

const populateEditForm = (animal) => {
    const form = document.getElementById("add-edit-animal-form");
    form._id.value = animal._id;
    form.name.value = animal.name;
    form.color.value = animal.color;
    form.size.value = animal.size;
    form.located.value = animal.located;
    form.diet.value = animal.diet;


    populateLocated(animal)
};

const populateLocated = (animal) => {
    const section = document.getElementById("description-boxes");

    animal.description.forEach((description) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = description;
        section.append(input);
    });
}

const addEditAnimal = async(e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-animal-form");
    const formData = new FormData(form);
    let response;
    formData.append("description", getDescription());

    //add animal
    if (form._id.value == -1) {
        formData.delete("_id");

        response = await fetch("/api/animals", {
            method: "POST",
            body: formData
        });
    }
    //edit an existing animal
    else {

        console.log(...formData);

        response = await fetch(`/api/animals/${form._id.value}`, {
            method: "PUT",
            body: formData
        });
    }

    //got data from server
    if (response.status != 200) {
        console.log("Error posting data");
    }

    animal = await response.json();

    if (form._id.value != -1) {
        displayDetails(animal);
    }

    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showAnimals();
};

const getDescription = () => {
    const inputs = document.querySelectorAll("#descrption-boxes input"); // Typo: should be "description-boxes" instead of "descrption-boxes"
    let description = [];

    inputs.forEach((input) => {
        description.push(input.value);
    });

    return description;
}

const resetForm = () => {
    const form = document.getElementById("add-edit-animal-form");
    form.reset();
    form._id.value = "-1";
    document.getElementById("descrption-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add Animal";
    resetForm();
};



window.onload = () => {
    showAnimals();
    document.getElementById("add-edit-animal-form").onsubmit = addEditAnimal;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-animal").onclick = addAnimal;
};