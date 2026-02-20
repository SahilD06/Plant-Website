
// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && !navMenu.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Close Modals when clicking outside the content area
    const modals = [
        { id: 'myModal', contentClass: 'modal-content' },
        { id: 'imageModal', contentClass: 'image-modal-content' },
        { id: 'mapModal', contentClass: 'map-modal-content' }
    ];

    modals.forEach(m => {
        const modal = document.getElementById(m.id);
        if (modal && modal.style.display === 'flex' || (modal && modal.style.display === 'block')) {
            const content = modal.querySelector(`.${m.contentClass}`);
            if (e.target === modal) {
                modal.style.display = 'none';
                if (m.id === 'mapModal') {
                    const mapContainer = document.getElementById('mapContainer');
                    if (mapContainer) mapContainer.innerHTML = '';
                }
            }
        }
    });
});

// Plant list panel toggle
const togglePanel = document.getElementById('toggle-panel');
const plantPanel = document.getElementById('plant-panel');
const closePanel = document.getElementById('close-panel');

if (togglePanel) {
    togglePanel.addEventListener('click', () => {
        plantPanel.classList.add('open');
    });
}

if (closePanel) {
    closePanel.addEventListener('click', () => {
        plantPanel.classList.remove('open');
    });
}

// Load plant data and populate side panel
document.addEventListener('DOMContentLoaded', () => {
    const plantList = document.getElementById('plant-list');
    const searchInput = document.getElementById('searchInput');

    // Fetch data from Gist
    fetch('https://gist.githubusercontent.com/SahilD06/a983c4f6a9b4c3e0842a22f3fbfd66f9/raw/28b743b5eabdd1794933395ca7974790c437a9eb/Plant_1.tsv')
        .then(response => response.text())
        .then(data => {
            const plants = parseCSV(data);
            window.plants = plants;

            if (plantList) {
                // Populate side panel
                plants.forEach(plant => {
                    const listItem = document.createElement('li');
                    const listItemLink = document.createElement('a');
                    listItemLink.href = '#';
                    listItemLink.textContent = plant.name;
                    listItemLink.addEventListener('click', (event) => {
                        event.preventDefault();
                        if (searchInput) searchInput.value = plant.name;
                        searchPlants();
                        if (plantPanel) plantPanel.classList.remove('open');
                    });
                    listItem.appendChild(listItemLink);
                    plantList.appendChild(listItem);
                });
            }

            // Initialize Plant of the Day
            updatePlantOfTheDay();
        })
        .catch(error => console.error('Error fetching plant data:', error));

    // Enter key search
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                searchPlants();
            }
        });
    }
});

function parseCSV(data) {
    const lines = data.trim().split('\n');
    // Skip the first line (header)
    return lines.slice(1).map(line => {
        // Split by Tab
        const fields = line.split('\t');

        return {
            name: fields[0] ? fields[0].trim() : '',              // Name of the Plant
            scientificName: fields[1] ? fields[1].trim() : '',     // Scientific Name
            description: fields[2] ? fields[2].trim() : '',        // Description
            webLink: fields[3] ? fields[3].trim() : '',            // Web Link
            youtubeLink: fields[4] ? fields[4].trim() : ''         // Youtube Link
        };
    });
}

function normalizeString(str) {
    return str.trim().toLowerCase();
}

function capitalizeWords(str) {
    if (!str) return '';
    return str.toLowerCase().trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function getImagePath(plantName) {
    const capitalized = capitalizeWords(plantName);
    // Hardcoded mapping for known extensions in Public folder
    const jpegPlants = [
        "Azaleas", "Chinese Fan Palm", "Cleyera", "Crape Jasmine",
        "Punarnava", "Saman Tree", "Vasaka Plant",
        "Japanese Sedge"
    ];

    const extension = jpegPlants.includes(capitalized) ? '.jpeg' : '.jpg';
    return `Public/${capitalized}${extension}`;
}

function searchPlants() {
    const searchInputElem = document.getElementById('searchInput');
    if (!searchInputElem) return;

    const searchInput = normalizeString(searchInputElem.value);
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';

    const filteredPlants = window.plants.filter(plant =>
        normalizeString(plant.name).includes(searchInput)
    );

    if (filteredPlants.length === 0) {
        resultsContainer.innerHTML = '<p class="not-found">No plants found</p>';
        openModal();
        return;
    }

    const displayedNames = new Set();

    filteredPlants.forEach((plant, index) => {
        if (!displayedNames.has(normalizeString(plant.name))) {
            displayedNames.add(normalizeString(plant.name));

            const imagePath = getImagePath(plant.name);
            console.log(`[Debug] Plant Card: "${plant.name}", Generated Image Path: "${imagePath}"`);

            const plantCard = document.createElement('div');
            plantCard.className = 'plant-card';
            plantCard.innerHTML = `
                <img src="${imagePath}" alt="${plant.name}" onclick="openImageModal('${imagePath}')" onerror="this.src='images/placeholder.jpg'">
                <div class="plant-details">
                    <h2>${plant.name}</h2>
                    <p><strong>Scientific Name:</strong> ${plant.scientificName}</p>
                    <p>${plant.description}</p>
                    <div class="plant-links">
                        <a href="${plant.webLink}" target="_blank" class="plant-link">
                            <i class="fas fa-info-circle"></i> More Info
                        </a>
                        <a href="${plant.youtubeLink}" target="_blank" class="plant-link">
                            <i class="fab fa-youtube"></i> Watch Video
                        </a>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(plantCard);

            setTimeout(() => {
                plantCard.style.opacity = 1;
                plantCard.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });

    openModal();
}

function openModal() {
    const modal = document.getElementById('myModal');
    if (modal) modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('myModal');
    if (modal) modal.style.display = 'none';
}

function openImageModal(imageSrc) {
    const modalImage = document.getElementById('modalImage');
    const imageModal = document.getElementById('imageModal');
    if (modalImage && imageModal) {
        modalImage.src = imageSrc;
        imageModal.style.display = 'flex';
    }
}

function closeImageModal() {
    const imageModal = document.getElementById('imageModal');
    if (imageModal) imageModal.style.display = 'none';
}

function openMapModal(location) {
    const apiKey = 'AIzaSyC_X8p8OmhmohqVseE0tGn9hb9n6zSeYl4';
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location.trim())}`;

    const mapContainer = document.getElementById('mapContainer');
    const mapModal = document.getElementById('mapModal');
    if (mapContainer && mapModal) {
        mapContainer.innerHTML = `<iframe width="100%" height="100%" frameborder="0" style="border:0" src="${mapUrl}" allowfullscreen></iframe>`;
        mapModal.style.display = 'block';
    }
}

function closeMapModal() {
    const mapModal = document.getElementById('mapModal');
    const mapContainer = document.getElementById('mapContainer');
    if (mapModal) mapModal.style.display = 'none';
    if (mapContainer) mapContainer.innerHTML = '';
}

// Plant of the Day functionality
function updatePlantOfTheDay() {
    const plantName = document.getElementById('plant-name');
    const plantTypeDisplay = document.getElementById('plant-type-display');
    const plantLocationDisplay = document.getElementById('plant-location-display');
    const viewBtn = document.getElementById('view-plant');
    const plantInfoContainer = document.getElementById('plant-info');

    if (!window.plants || window.plants.length === 0) return;

    const randomIndex = Math.floor(Math.random() * window.plants.length);
    const plant = window.plants[randomIndex];

    if (plantName) plantName.innerText = plant.name;
    if (plantTypeDisplay) plantTypeDisplay.innerHTML = `<strong>Scientific Name:</strong> ${plant.scientificName}`;
    if (plantLocationDisplay) plantLocationDisplay.innerHTML = `<em>${plant.description.substring(0, 150)}...</em>`;

    // Update or create image for Plant of the Day
    let plantImg = document.getElementById('potd-image');
    if (plantInfoContainer) {
        if (!plantImg) {
            plantImg = document.createElement('img');
            plantImg.id = 'potd-image';
            plantImg.style.width = '100%';
            plantImg.style.maxWidth = '400px';
            plantImg.style.borderRadius = '15px';
            plantImg.style.marginBottom = '20px';
            plantImg.style.cursor = 'pointer';
            plantImg.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            plantInfoContainer.insertBefore(plantImg, plantTypeDisplay);
        }
        const imgPath = getImagePath(plant.name);
        plantImg.src = imgPath;
        plantImg.alt = plant.name;
        plantImg.onclick = () => openImageModal(imgPath);
    }

    if (viewBtn) {
        viewBtn.onclick = () => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = plant.name;
            searchPlants();
        };
    }
}

// Next plant button listener
document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('next-plant');
    if (nextBtn) {
        nextBtn.addEventListener('click', updatePlantOfTheDay);
    }
});
