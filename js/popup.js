const sendKeywords = () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, localStorage);
        console.log(localStorage);
    });
}

const addNewKeyword = () => {
    localStorage.setItem("AntiSpoilerKeywords", keywords);
}

const addKeywordHandler = () => {
    const keyword = document.querySelector(".form-control#inputKeywords").value;
    
    if (keyword == "") return;
    
    let dateText = document.querySelector(".form-control#inputDate").value;
    const date = document.querySelector(".form-control#inputDate").valueAsDate;

    if (date == null) {
        keywords.push(keyword);
    } else {
        keywords.push(keyword + `(после ${dateText})`);
    }

    addNewKeyword();
    renderKeywords();

}

const getKeywords = () => {
    const keywords = localStorage.getItem("AntiSpoilerKeywords");
    if (keywords == null || !keywords.length) return [];
    return keywords.split(",");
}

const createBadge = (index, content) => {
    const badge = document.createElement("span");
    badge.className = "keywords__item badge bg-primary";
    badge.dataset.id = index;
    badge.textContent = content;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn-close btn-close-white";
    button.ariaLabel = "Close";
    
    button.addEventListener("click", removeKeyword);

    badge.appendChild(button);

    return badge;
}

const removeKeyword = (event) => {
    const index = event.target.parentElement.dataset.id;
    const keyword = keywords.splice(index, 1);
    localStorage.setItem("AntiSpoilerKeywords", keywords.join(","))
    
    renderKeywords();
}

const renderKeywords = () => {
    elementList.innerHTML = "";
    if (!keywords.length) {
        const error = document.createElement("p");
        error.className = "keywords__error"
        error.textContent = "Активных ключевых слов нет =(";
        elementList.appendChild(error);
    }

    keywords.forEach((description, index) => {
        elementList.appendChild(createBadge(index, description));
    });
}

const renderSwitches = () => {
    const isRemoveImage = localStorage.getItem("AntiSpoilerRemoveImage") === "true";
    const isRemoveVideo = localStorage.getItem("AntiSpoilerRemoveVideo") === "true";

    switches[0].checked = isRemoveImage;
    switches[1].checked = isRemoveVideo;
}

const switchHandler = (event) => {
    const condition = event.target.checked;
    if (event.target.id == "switchImage") {
        localStorage.setItem("AntiSpoilerRemoveImage", condition);
    } else {
        localStorage.setItem("AntiSpoilerRemoveVideo", condition);
    }
} 



let keywords = getKeywords();
const elementList = document.querySelector(".grid__list.keywords");
const button = document.querySelector(".btn#addKeyword");
const switches = document.querySelectorAll(".form-check-input");
const sendButton = document.querySelector(".btn#send");

renderKeywords();
renderSwitches();

button.addEventListener("click", addKeywordHandler);
sendButton.addEventListener("click", sendKeywords);
switches.forEach(el => { el.addEventListener("change", switchHandler) });