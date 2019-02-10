import { deleteButtonClick } from "./bulma/deleteButtonClick";

function messageGenerator(type, headerText, message) {
    const article = createArticle(type);

    //#region MESSAGE_HEADER
    const messageHeader = createMessageHeader();

    const headerTitle  = createHeaderTitle(headerText);
    const deleteButton = createDeleteButton();

    messageHeader.appendChild(headerTitle);
    messageHeader.appendChild(deleteButton);

    article.appendChild(messageHeader);
    //#endregion

    //#region MESSAGE_BODY
    const messageBody = createMessageBody(message);

    article.appendChild(messageBody);
    //#endregion

    return article;
}

function createArticle(type) {
    const article = document.createElement("article");
    article.classList.add(`message`, `is-${type}`);

    return article;
}

function createMessageHeader() {
    const messageHeader = document.createElement("div");
    messageHeader.classList.add("message-header");

    return messageHeader;
}

function createHeaderTitle(headerText) {
    const messageHeaderP = document.createElement("p");
    messageHeaderP.innerText = headerText;

    return messageHeaderP;
}

function createDeleteButton() {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.setAttribute("aria-label", "delete");
    deleteButton.onclick = deleteButtonClick;

    return deleteButton;
}

function createMessageBody(message) {
    const messageBody = document.createElement("div");
    messageBody.classList.add("message-body");
    messageBody.innerText = message;

    return messageBody;
}

export { messageGenerator };