function deleteButtonClick(e) {
    const message = e.target.parentNode.parentNode;
    message.remove();
}

export { deleteButtonClick };