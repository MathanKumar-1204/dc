import { database } from './firebaseconfig.js'; // Make sure this is correctly set up
import { ref, push, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Upload Furniture Function
document.getElementById("sell-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const furnitureData = {
        name: document.getElementById("name").value,
        type: document.getElementById("type").value,
        location: document.getElementById("location").value,
        condition: document.getElementById("condition").value,
        price: document.getElementById("price").value,
        contact: document.getElementById("contact").value,
        phone: document.getElementById("phone").value,
    };

    // Convert image to Base64
    const imageFile = document.getElementById("image").files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
        furnitureData.image = reader.result;
        await push(ref(database, 'furniture'), furnitureData);
        alert("Furniture added successfully!");
        window.location.href = 'index.html';
    };
    reader.readAsDataURL(imageFile);
});

// Fetch Furniture Function
async function fetchFurniture() {
    const dbRef = ref(database, 'furniture');
    const snapshot = await get(dbRef);
    const furnitureData = snapshot.val();
    return furnitureData ? Object.entries(furnitureData).map(([id, furniture]) => ({ id, ...furniture })) : [];
}

// Display Furniture Function
async function displayFurniture(furnitureList) {
    const container = document.getElementById("furniture-list");
    container.innerHTML = ""; // Clear previous items
    furnitureList.forEach(({ id, image, name, price, location, type }) => {
        const furnitureCard = document.createElement("div");
        furnitureCard.classList.add("furniture-card");
        furnitureCard.innerHTML = `
            <img src="${image}" alt="${name}">
            <h2>${name}</h2>
            <p>Type: ${type}</p>
            <p>Price: $${price}</p>
            <p>Location: ${location}</p>
            <button class="buy-btn" data-id="${id}">Buy</button>
        `;
        container.appendChild(furnitureCard);
    });

    // Attach event listeners to the "Buy" buttons
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', () => {
            viewFurniture(button.dataset.id);
        });
    });
}

// View Furniture Details Function
async function viewFurniture(id) {
    const furnitureList = await fetchFurniture();
    const furniture = furnitureList.find(item => item.id === id);

    if (furniture) {
        document.getElementById('modal-image').src = furniture.image;
        document.getElementById('modal-name').textContent = furniture.name;
        document.getElementById('modal-type').textContent = `Type: ${furniture.type}`;
        document.getElementById('modal-price').textContent = `Price: $${furniture.price}`;
        document.getElementById('modal-location').textContent = `Location: ${furniture.location}`;
        document.getElementById('modal-condition').textContent = `Condition: ${furniture.condition}`;
        document.getElementById('modal-contact').textContent = `Contact: ${furniture.contact}`;
        document.getElementById('modal-phone').textContent = `Phone: ${furniture.phone}`;

        document.getElementById('furniture-modal').style.display = 'block';
    }
}

// Close Modal Function
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('furniture-modal').style.display = 'none';
});

// Apply Filters Function
async function applyFilters() {
    const location = document.getElementById('filter-location').value.toLowerCase();
    const minPrice = parseFloat(document.getElementById('filter-price-min').value) || 0;
    const maxPrice = parseFloat(document.getElementById('filter-price-max').value) || Infinity;
    const type = document.getElementById('filter-type').value;
    const condition = document.getElementById('filter-condition').value;

    console.log('Filters:', { location, minPrice, maxPrice, type, condition }); // Debugging log

    const furnitureList = await fetchFurniture();
    const filteredFurniture = furnitureList.filter(furniture => {
        const matchesLocation = furniture.location.toLowerCase().includes(location);
        const matchesPrice = furniture.price >= minPrice && furniture.price <= maxPrice;
        const matchesType = type ? furniture.type === type : true;
        const matchesCondition = condition ? furniture.condition === condition : true;

        return matchesLocation && matchesPrice && matchesType && matchesCondition;
    });

    console.log('Filtered Furniture:', filteredFurniture); // Debugging log
    displayFurniture(filteredFurniture);
}

// Attach the filter button to the applyFilters function
document.getElementById('filter-btn').addEventListener('click', applyFilters);

// Load all furniture on page load
window.onload = async () => {
    const furnitureList = await fetchFurniture();
    displayFurniture(furnitureList);
};
