document.addEventListener("DOMContentLoaded", () => {
    const quoteText = document.querySelector(".quote");
    const authorName = document.querySelector(".author .name");
    const quoteBtn = document.querySelector("button");
    const soundBtn = document.querySelector(".sound");
    const copyBtn = document.querySelector(".copy");
    
    // Function to fetch and display a random quote
    function randomQuote() {
        quoteBtn.classList.add("loading");
        quoteBtn.innerText = "Loading Quote...";
    
        fetch("https://api.quotable.io/random")
            .then(res => res.json())
            .then(result => {
                quoteText.innerText = result.content;
                authorName.innerText = result.author;
                quoteBtn.innerText = "New Quote";
                quoteBtn.classList.remove("loading");
    
                // Update the text for the sound and copy buttons
                soundBtn.dataset.text = `"${result.content}" — ${result.author}`;
                copyBtn.dataset.text = `"${result.content}" — ${result.author}`;
            })
            .catch(error => {
                quoteText.innerText = "Failed to fetch quote.";
                authorName.innerText = "";
                quoteBtn.innerText = "Try Again";
                quoteBtn.classList.remove("loading");
                console.error("Error fetching quote:", error);
            });
    }
    
    // Function to read the quote aloud
    soundBtn.addEventListener("click", () => {
        let utterance = new SpeechSynthesisUtterance(quoteText.innerText + " by " + authorName.innerText);
        speechSynthesis.speak(utterance);
    });
    
    // Function to copy the quote to clipboard
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(quoteText.innerText + " — " + authorName.innerText)
            .then(() => {
                alert("Quote copied to clipboard!");
            })
            .catch(err => {
                console.error("Failed to copy quote:", err);
            });
    });
    
    // Event listener for the new quote button
    quoteBtn.addEventListener("click", randomQuote);
})    