
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const plantName = urlParams.get('name');

    if (!plantName) {
        showError("No plant specified.");
        return;
    }

    fetch('https://gist.githubusercontent.com/SahilD06/a983c4f6a9b4c3e0842a22f3fbfd66f9/raw/c95a8ab0cf20ceb42dd3013d769f8d04767f6d83/Plant_1.tsv')
        .then(response => response.text())
        .then(data => {
            const plants = parseTSV(data);
            const plant = plants.find(p => p.name.toLowerCase() === plantName.toLowerCase());

            if (plant) {
                renderPlantDetails(plant);
            } else {
                showError(`Plant "${plantName}" not found in our database.`);
            }
        })
        .catch(error => {
            console.error('Error fetching plant data:', error);
            showError("Failed to load plant data. Please try again later.");
        });
});

function parseTSV(data) {
    const lines = data.trim().split('\n');
    return lines.slice(1).map(line => {
        const fields = line.split('\t');
        return {
            name: fields[0],
            scientificName: fields[1],
            description: fields[2],
            webLink: fields[3],
            youtubeLink: fields[4]
        };
    });
}

function capitalizeWords(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function getImagePath(plantName) {
    const capitalized = capitalizeWords(plantName);
    const jpegPlants = [
        "Azaleas", "Chinese Fan Palm", "Cleyera", "Crape Jasmine",
        "Punarnava", "Saman Tree", "Vasaka Plant",
        "Yellow Flame Tree, Golden Flamboyante Or Yellow Poinciana.",
        "Centipede Tongavine, Taro Vine, Silver Vine And Dragon-tail Plant",
        "Japanese Sedge"
    ];

    const extension = jpegPlants.includes(capitalized) ? '.jpeg' : '.jpg';
    return `Public/${capitalized}${extension}`;
}

function renderPlantDetails(plant) {
    const container = document.getElementById('details-container');
    const imagePath = getImagePath(plant.name);

    container.innerHTML = `
        <div class="details-card animate-fade-in">
            <div class="details-image">
                <img src="${imagePath}" alt="${plant.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="details-content">
                <h1 class="plant-title">${plant.name}</h1>
                <p class="scientific-name"><em>${plant.scientificName}</em></p>
                
                <div class="description-box">
                    <h3>Description</h3>
                    <p>${plant.description}</p>
                </div>

                <div class="action-buttons">
                    <a href="${plant.webLink}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-info-circle"></i> More Information
                    </a>
                    <a href="${plant.youtubeLink}" target="_blank" class="btn btn-secondary">
                        <i class="fab fa-youtube"></i> Watch Video
                    </a>
                </div>

                <div class="qr-notice">
                    <p><i class="fas fa-qrcode"></i> This page was accessed via QR code at Public Recreation Ground.</p>
                </div>
                
                <div class="back-link">
                    <a href="index.html"><i class="fas fa-arrow-left"></i> Back to Archive</a>
                </div>
            </div>
        </div>
    `;
}

function showError(message) {
    const container = document.getElementById('details-container');
    container.innerHTML = `
        <div class="error-card animate-fade-in">
            <i class="fas fa-exclamation-triangle"></i>
            <h2>Oops!</h2>
            <p>${message}</p>
            <a href="index.html" class="btn btn-primary">Return to Homepage</a>
        </div>
    `;
}
