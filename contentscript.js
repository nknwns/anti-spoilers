const preventDefault = () => {
    document.querySelectorAll('.spoilerBlurImage').forEach(el => {el.classList.remove('spoilerBlurImage')});
    document.querySelectorAll('.spoilerBlur').forEach(el => {el.classList.remove('spoilerBlur')});
}

const filterKeywords = (keywordsText) => {
    const keywords = keywordsText.toLowerCase().split(",");

    if (!keywords[0].length) return [];

    let keys = [];

    for (let i = 0; i < keywords.length; i++) {
        if (keywords[i].includes("(")) {
            const dateStartIndex = keywords[i].indexOf("(");
            const content = keywords[i].slice(0, dateStartIndex);
            const dateOfText = keywords[i].slice(dateStartIndex + 7, keywords[i].length - 1);

            const keywordDate = new Date(dateOfText);
            const currentDate = new Date();
            if (currentDate >= keywordDate) keys.push(content);
        } else {
            keys.push(keywords[i]);
        }

        keys.push(keywords[i].toLowerCase());
    }
    
    return keys;
}

const removeSpoilerImage = (keywords) => {
    const images = document.querySelectorAll("img");

    images.forEach(el => {
        const tags = el.alt.toLowerCase();
        let isSpoiler = false;
        
        keywords.forEach(keyword => {
            if (tags.includes(keyword)) isSpoiler = true; 

            const cloneNode = el.parentElement.cloneNode(1);
            while (cloneNode.lastElementChild) cloneNode.removeChild(cloneNode.lastElementChild);
            const nodeContent = cloneNode.textContent.toLowerCase();
            
            if (nodeContent.includes(keyword)) isSpoiler = true;

        });

        if (isSpoiler) el.classList.add("spoilerBlurImage");
    });
}

const removeSpoilerVideo = (keywords) => {
    /* Idk */ 
}

const removeSpoilerText = (keywords, imageCondition) => {
    const localBody = document.body.cloneNode(true);

    for (let i = 0; i < keywords.length; i++) {
        const currentContent = localBody.textContent.toLowerCase();
        if (!currentContent.includes(keywords[i])) continue; 
        
        let queue = [localBody];
        let blurs = [];
        let blursImage = [];

        while (queue.length) {
            const queueSize = queue.length;
            
            for (let j = 0; j < queueSize; j++) {
                const textAllNodes = queue[j].textContent.toLowerCase();
                if (!textAllNodes.includes(keywords[i])) continue;

                const cloneElement = queue[j].cloneNode(true);
                while (cloneElement.lastElementChild) cloneElement.removeChild(cloneElement.lastElementChild);

                const textCurrentNode = cloneElement.textContent.toLowerCase();
                
                if (textCurrentNode.includes(keywords[i])) {
                    if (!blurs.includes(queue[j])) {
                        blurs.push(queue[j]);
                        if (imageCondition) {
                            const images = queue[j].parentElement.querySelectorAll("img");
                            blursImage = blursImage.concat(Array.from(images));
                        }
                    }
                } else {
                    queue = queue.concat(Array.from(queue[j].children));
                }
            }

            queue.splice(0, queueSize);
        }

        blurs.forEach(el => {el.classList.add("spoilerBlur")});

        if (imageCondition) blursImage.forEach(el => {el.classlist.add("spoilerBlurImage")});

        document.body = localBody;
    }
}

const messageHandler = (message) => {
    const keywords = filterKeywords(message.AntiSpoilerKeywords);
    const imageCondition = message.AntiSpoilerRemoveImage === "true";
    const videoCondition = message.AntiSpoilerRemoveVideo === "true";

    if (!keywords[0].length) {
        sendToast("warning", "Ключевые слова отсутствуют");
        return;
    }

    preventDefault();

    removeSpoilerText(keywords, imageCondition);

    if (imageCondition) removeSpoilerImage(keywords);
    if (videoCondition) removeSpoilerVideo(keywords);

}

chrome.runtime.onMessage.addListener(messageHandler);