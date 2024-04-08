let selectedCraft = null;

const showCrafts = async () => {
  const craftsJSON = await getJSON();

  if (craftsJSON == "") return;

  let craftsDiv = document.getElementById("crafts-container");

  craftsJSON.forEach((craft) => {
    let column = document.createElement("div");
    column.classList.add("column");
    craftsDiv.append(column);

    let img = document.createElement("img");
    column.append(img);
    img.src = `/images/${craft.image}`;
    img.alt = craft.name;
    img.onclick = () => showModal(craft);
  });
};

const showModal = (craft) => {
  selectedCraft = craft;
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <div class="modal-left">
      <img src="/images/${craft.image}" alt="${craft.name}">
    </div>
    <div class="modal-right">
      <span class="close">&times;</span>
      <h2>${craft.name}</h2>
      <p>${craft.description}</p>
      <h3>Supplies:</h3>
      <ul>
        ${craft.supplies.map((supply) => `<li>${supply}</li>`).join("")}
      </ul>
    </div>
  `;
  const closeModal = () => {
    modal.style.display = "none";
  };
  const closeBtn = modalContent.querySelector(".close");
  closeBtn.onclick = closeModal;
  window.onclick = (event) => {
    if (event.target == modal) {
      closeModal();
    }
  };
};

const getJSON = async () => {
  try {
    let response = await fetch("/api/crafts");
    let craftsJSON = await response.json();
    return craftsJSON;
  } catch (error) {
    console.log(error);
    return "";
  }
};

window.onload = () => {
  showCrafts();

  document.getElementById("add-craft-link").onclick = () => openCraftDialog();

  document.getElementById("add-craft-form").onsubmit = async (e) => {
    e.preventDefault();
    await addCraft();
  };

  document.getElementById("add-supply").onclick = (e) => {
    e.preventDefault();
    addSupplyInput();
  };

  document.getElementById("cancel-btn").onclick = (e) => {
    e.preventDefault();
    closeCraftDialog();
  };

  document.getElementById("craft-dialog").addEventListener("click", (e) => {
    if (e.target === document.getElementById("craft-dialog")) {
      resetCraftForm();
      closeCraftDialog();
    }
  });
  animateAddCraftLink();
};

const animateAddCraftLink = () => {
  const addCraftLink = document.getElementById("add-craft-link");
  addCraftLink.classList.add("animate-fadeIn");
  setTimeout(() => {
    addCraftLink.classList.remove("animate-fadeIn");
  }, 1000);
};

const openCraftDialog = () => {
  const modal = document.getElementById("craft-dialog");
  modal.style.display = "block";
  modal.classList.add("animate-fadeIn");
};

const closeCraftDialog = () => {
  const modal = document.getElementById("craft-dialog");
  modal.classList.add("animate-fadeOut");
  setTimeout(() => {
    modal.style.display = "none";
    modal.classList.remove("animate-fadeOut");
  }, 500);
};

const resetCraftForm = () => {
  document.getElementById("add-craft-form").reset();
  document.getElementById("supplies-container").innerHTML = "";
  document.getElementById("img-prev").src = "";
};

const addCraft = async () => {
  const form = document.getElementById("add-craft-form");
  const formData = new FormData(form);

  const supplies = Array.from(form.querySelectorAll('[data-supply]')).map(input => input.value.trim());
  formData.append('supplies', supplies.join(','));

  const response = await fetch("/api/crafts", {
    method: "POST",
    body: formData,
  });
  if (response.ok) {
    const newCraft = await response.json();
    resetCraftForm();
    closeCraftDialog();
    appendCraftToList(newCraft);
  } else {
    console.error("Failed to add craft");
  }
};


const addSupplyInput = () => {
  const suppliesContainer = document.getElementById("supplies-container");
  const input = document.createElement("input");
  input.type = "text";
  input.dataset.supply = true;
  suppliesContainer.appendChild(input);
  suppliesContainer.appendChild(document.createElement("br"));
};


document.getElementById("craft-img").onchange = (e) => {
  if (!e.target.files.length) {
    document.getElementById("img-prev").src = "";
    return;
  }
  document.getElementById("img-prev").src = URL.createObjectURL(
    e.target.files.item(0)
  );
};

const appendCraftToList = (craft) => {
  let craftsDiv = document.getElementById("crafts-container");

  let column = document.createElement("div");
  column.classList.add("column");
  craftsDiv.appendChild(column);

  let img = document.createElement("img");
  column.appendChild(img);
  img.src = `/images/${craft.image}`;
  img.alt = craft.name;
  img.onclick = () => showModal(craft);
};