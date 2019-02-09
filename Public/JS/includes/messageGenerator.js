function messageGenerator(type, header, message) {
    return `<article class="message is-${type}">
<div class="message-header">
    <p>${header}</p>
    <button class="delete" aria-label="delete"></button>
</div>
<div class="message-body">
    ${message}
</div>
</article>`;
}

export { messageGenerator };