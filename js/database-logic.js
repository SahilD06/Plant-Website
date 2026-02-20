
document.addEventListener('DOMContentLoaded', () => {
    const speciesGrid = document.getElementById('species-grid');

    fetch('https://gist.githubusercontent.com/SahilD06/a983c4f6a9b4c3e0842a22f3fbfd66f9/raw/28b743b5eabdd1794933395ca7974790c437a9eb/Plant_1.tsv')
        .then(response => response.text())
        .then(data => {
            const plants = parseTSV(data);
            renderSpeciesGrid(plants);
        })
        .catch(error => {
            console.error('Error fetching plant data:', error);
            if (speciesGrid) {
                speciesGrid.innerHTML = '<p style="color: #e53e3e; text-align: center; grid-column: 1/-1;">Failed to load species archive.</p>';
            }
        });
});

function parseTSV(data) {
    const lines = data.trim().split('\n');
    return lines.slice(1).map(line => {
        const fields = line.split('\t');
        return {
            name: fields[0] ? fields[0].trim() : '',
            scientificName: fields[1] ? fields[1].trim() : ''
        };
    });
}

function capitalizeWords(str) {
    if (!str) return '';
    return str.toLowerCase().trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function getImagePath(plantName) {
    const capitalized = capitalizeWords(plantName);
    const jpegPlants = [
        "Azaleas", "Chinese Fan Palm", "Cleyera", "Crape Jasmine",
        "Punarnava", "Saman Tree", "Vasaka Plant",
        "Japanese Sedge"
    ];

    const extension = jpegPlants.includes(capitalized) ? '.jpeg' : '.jpg';
    return `Public/${capitalized}${extension}`;
}

function renderSpeciesGrid(plants) {
    const speciesGrid = document.getElementById('species-grid');
    if (!speciesGrid) return;

    speciesGrid.innerHTML = '';

    plants.forEach(plant => {
        const imagePath = getImagePath(plant.name);
        console.log(`[Debug] Archive Card: "${plant.name}", Generated Image Path: "${imagePath}"`);
        const detailUrl = `plant-details.html?name=${encodeURIComponent(plant.name)}`;

        const card = document.createElement('div');
        card.className = 'info-card';
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.3s ease';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.gap = '15px';

        card.innerHTML = `
            <div style="width: 100%; height: 180px; overflow: hidden; border-radius: 10px;">
                <img src="${imagePath}" alt="${plant.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div>
                <h3 style="margin-bottom: 5px; font-size: 20px;">${plant.name}</h3>
                <p style="font-size: 14px; color: #4CAF50; font-style: italic; margin-bottom: 10px;">${plant.scientificName}</p>
                <a href="${detailUrl}" class="plant-link" style="font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                    <i class="fas fa-qrcode"></i> View QR Landing Page
                </a>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = detailUrl;
        });

        // Hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.borderColor = '#4CAF50';
            card.style.boxShadow = '0 10px 30px rgba(76, 175, 80, 0.15)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            card.style.boxShadow = 'none';
        });

        speciesGrid.appendChild(card);
    });
}
