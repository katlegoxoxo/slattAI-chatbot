const sideNavigation = document.querySelector(".sideNavigation"),
    sideBarToggle = document.querySelector(".fa-solid fa-bars"),
    startContentUl = document.querySelector(".startContentUl ul"),
    inputArea = document.querySelector(".inputArea input"),
    sendRequest = document.querySelector(".fa-solid fa-paper-plane"),
    chatHistory = document.querySelector(".chatHistory"),
    startContent = document.querySelector(".startContent"),
    chatContent = document.querySelector(".chatContent"),
    results = document.querySelector(".results");

promptQuestions = [
    { question: "Create a motivational quote for developers", icon: "fa-solid fa-lightbulb" },
    { question: "Design a responsive login page with CSS", icon: "fa-solid fa-user-lock" },
    { question: "How to set up a Node.js server?", icon: "fa-solid fa-server" },

];

window.addEventListener("load", () => {
    promptQuestions.forEach((data) => {
        let item = document.createElement("li");
        item.addEventListener("click", () => {
            getGeminiResponse(data.question, true);
        })
        item.innerHTML = `
        <div class="promptSuggestion">
            <p>${data.question}</p>
            <div class="icon"><i class="${data.icon}"></i></div>
        </div>`;

        // Ensure startContentUl is correctly referenced
        const startContentUl = document.querySelector(".startContent ul");
        if (startContentUl) {
            startContentUl.append(item);
        } else {
            console.error("startContentUl element not found in the DOM.");
        }

        console.log(data);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const sideBarToggle = document.querySelector(".fa-bars");
    const sideNavigation = document.querySelector(".sideNavigation");

    if (sideBarToggle && sideNavigation) {
        sideBarToggle.addEventListener("click", () => {
            sideNavigation.classList.toggle("expandClose");
            console.log("Sidebar toggle clicked!");
        });
    } else {
        console.error("sideBarToggle or sideNavigation not found in the DOM.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const inputArea = document.querySelector(".inputArea input");
    const sendRequest = document.querySelector(".fa-solid.fa-paper-plane");

    console.log("inputArea:", inputArea);
    console.log("sendRequest:", sendRequest);

    if (inputArea && sendRequest) {
        inputArea.addEventListener("keyup", (e) => {
            if (e.target.value.length > 0) {
                sendRequest.style.display = "inline";
            } else {
                sendRequest.style.display = "none";
            }
        });
    } else {
        console.error("inputArea or sendRequest not found in the DOM.");
    }
});

sendRequest.addEventListener("click", () => {
    getGeminiResponse(inputArea.value, true);
})

function getGeminiResponse(question, appendHistory) {
    console.log(question);

    let historyLi = document.createElement("li");
    historyLi.innerHTML = `<i class="fa-solid fa-message"></i>${question}`;
    chatHistory.append(historyLi);

    const AIURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC5lD-EVeT9bCrxH967PxQ-1rNEsAvle9w`

    fetch(AIURL, {
        method: "POST",
        body: JSON.stringify({
            "contents": [{
                "parts": [{ text: question }]}],
        }),

    }).then((response) => response.json()).then ((data) =>{
        console.log(data);
    })
}