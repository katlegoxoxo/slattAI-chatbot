const sideNavigation = document.querySelector(".sideNavigation"),
    sideBarToggle = document.querySelector(".fa-solid fa-bars"),
    startContentUl = document.querySelector(".startContentUl ul"),
    inputArea = document.querySelector(".inputArea input"),
    sendRequest = document.querySelector(".fa-solid.fa-paper-plane"),
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
        // Show or hide the send button based on input
        inputArea.addEventListener("keyup", (e) => {
            if (e.target.value.length > 0) {
                sendRequest.style.display = "inline";
            } else {
                sendRequest.style.display = "none";
            }
        });

        // Trigger send button when Enter key is pressed
        inputArea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && inputArea.value.length > 0) {
                sendRequest.click(); // Simulate a click on the send button
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

    const chatHistory = document.querySelector(".chatHistory ul");
    const results = document.querySelector(".results");
    const inputArea = document.querySelector(".inputArea input");
    const startContent = document.querySelector(".startContent");
    const chatContent = document.querySelector(".chatContent");
    if (appendHistory) {
        // Add question to chat history
        let historyLi = document.createElement("li");
        historyLi.addEventListener("click", () => {
            getGeminiResponse(question, false)
        })
        historyLi.innerHTML = `<i class="fa-solid fa-message"></i>${question}`;
        chatHistory.append(historyLi);

    }

    // Clear input area
    inputArea.value = "";

    // Show chat content and hide start content
    startContent.style.display = "none";
    chatContent.style.display = "block";

    let resultTitle = `
<div class="resultsTitle">

<p>${question}</p>
</div>`;

    let resultData = `<div class = "resultData">
<img src="images/xx.png" alt="Black" />

<div class= "loader">
<div class= "animatedBG"></div>
<div class= "animatedBG"></div>
<div class= "animatedBG"></div>
</div>`;

    results.innerHTML += resultTitle;
    results.innerHTML += resultData;
    const AIURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC5lD-EVeT9bCrxH967PxQ-1rNEsAvle9w`;

    fetch(AIURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: question }],
                },
            ],
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
                let responseData = jsonEscape(data.candidates[0].content.parts[0].text)

                let responseArray = responseData.split("**");
                let newResponse = "";

                for (let i = 0; i < responseArray.length; i++) {
                    if (i == 0 || i % 2 !== 1) {
                        newResponse += responseArray[i];
                    } else {
                        newResponse += "<strong>" + responseArray[i].split(" ").join("&nbsp") + "</strong>";
                    }
                }
                let newResponse2 = newResponse.split("*").join("");
                let textArea = document.createElement("textArea");
                textArea.innerHTML = newResponse2;


                results.innerHTML += `
                <div class = "resultResponse"> 
               <img src="images/xx.png" alt="Black" style="margin-right: 10px; border-radius: 50%; height: 32px; width: 32px;" />

                <p id= "typeEffect"> ${newResponse}</p>
                </div>`;

                let newResponseData = newResponse2.split("");
                for (let j = 0; j < newResponseData.length; j++) {
                    timeOut(j, newResponseData[j] + "");
                }

                // results.innerHTML = data.candidates[0].content.parts[0].text;
                console.log("AI Response:", data.candidates[0].content.parts[0].text);
                document.querySelector(".results .resultData").remove();

            } else {
                results.innerHTML = "No response from AI. Try again later.";
            }
        })
        .catch((error) => {
            console.error("Error fetching AI response:", error);
            results.innerHTML = "Error fetching AI response. Try again later.";
        });
}

const timeOut = (index, nextWord) => {
    setTimeout(() => {
        document.getElementById("typeEffect").innerHTML += nextWord;
    }, 75 * index);
}

function newChat() {
    startContent.style.display = "block";
    chatContent.style.display = "none";

}

function jsonEscape(str) {
    return str
        .replace(new RegExp("\r?\n\n", "g"), "<br>")
        .replace(new RegExp("\r?\n", "g"), "<br>");
}