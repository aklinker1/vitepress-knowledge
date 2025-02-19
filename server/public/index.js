const styles = document.createElement("style");
styles.innerHTML = `
.chat-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  font-size: 14px;
  font-weight: 600;
  transition: 200ms ease;
}
.chat-btn:hover {
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
}
.chat-btn:active {
  color: var(--vp-button-brand-active-text);
  background-color: var(--vp-button-brand-active-bg);
}
.chat-btn:disabled {
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  opacity: 50%;
}

.ask-ai-btn {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  z-index: 1;
}
.ask-ai-btn > i {
  width: 20px;
  height: 20px;
}

.chat-window-overlay {
  z-index: 1000;
  position: fixed;
  inset: 0;
}
.chat-window {
  margin: auto;
  width: 100%;
  height: 100%;
  background-color: var(--vp-c-bg);
  cursor: default;
  display: flex;
  flex-direction: column;
}
@media (min-width: 768px) {
  .chat-window-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    cursor: pointer;
    padding: 2rem;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
  .chat-window {
    width: 900px;
    height: 80%;
    border-radius: 16px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }
}

.chat-window-title-section {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  align-items: center;
  border-bottom: 1px solid var(--vp-c-gutter);
}
.chat-window-title-section > .icon {
  width: 24px;
  height: 24px;
}
.chat-window-title-section > .title {
  font-weight: 600;
  font-size: 16px;
  flex: 1;
}
.chat-window-title-section > .title::after {
  font-weight: 600;
  font-size: 10px;
  content: 'VERY ALPHA';
  margin-left: 0.5rem;
  vertical-align: top;
  color: var(--vp-c-warning-1);
  background-color: var(--vp-c-warning-soft);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}
.chat-window-title-section > button > i {
  width: 20px;
  height: 20px;
}

.chat-window-messages-section {
  flex: 1;
  position: relative;
}
.chat-window-messages-section > div {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
}

.powered-by {
  text-align: center;
  opacity: 70%;
}
.powered-by a {
  color: unset !important;
  font-weight: unset !important;
}

.chat-message {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  max-width: 90%;
  font-size: 14px;
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .chat-message {
    max-width: 90%;
  }
}
.chat-message.markdown {
  white-space: pre-wrap;
}
.chat-message.user {
  align-self: flex-end;
  background-color: var(--vp-c-brand-soft);
  border-bottom-right-radius: 0px;
}
.chat-message.assistant {
  align-self: flex-start;
  background-color: var(--vp-c-default-soft);
  border-bottom-left-radius: 0px;
  position: relative;
  margin-left: 40px;
}
.chat-message.assistant::before {
  content: "";
  position: absolute;
  width: 24px;
  height: 24px;
  left: -40px;
  bottom: 0;
  background-image: url('{{ ASSISTANT_ICON_URL }}');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.chat-message > * {
  display: block;
  margin: 0;
  padding: 0;
  cursor: text;
}
.chat-message, .chat-message > ul, .chat-message > ol {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.chat-message > ul, .chat-message > ol  {
  margin-left: 24px;
}
.chat-message > ol {
  list-style: decimal;
}
.chat-message > ul {
  list-style: disc;
}
.chat-message pre {
  overflow-x: auto;
  line-height: var(--vp-code-line-height);
  font-family: var(--vp-font-family-mono);
  font-size: var(--vp-code-font-size);
  background-color: var(--vp-code-block-bg);
  border-radius: 8px;
  padding: 0.5rem;
}
.chat-message code:not(pre code) {
  color: var(--vp-code-color);
  font-size: var(--vp-code-font-size);
  font-family: var(--vp-font-family-mono);
  background-color: var(--vp-code-bg);
  padding: 3px 6px;
  border-radius: 4px;
}
.chat-message a, .chat-link {
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.25s, opacity 0.25s;
}
.chat-message a:hover, .chat-link:hover {
  color: var(--vp-c-brand-2);
}

.chat-window-input-section {
  margin: 0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  background: var(--vp-c-gray-3);
  border: 1px solid var(--vp-c-gray-3);
  border-radius: 8px;
  transition: 200ms ease;
}
.chat-window-input-section:focus-within {
  border: 1px solid var(--vp-c-brand);
}
.chat-window-input-section > textarea {
  min-width: 0;
  flex: 1;
  height: 100px;
  padding: 0.75rem;
  font-size: 14px;
  font-family: var(--vp-font-family-base);
  line-height: 150%;
  resize: none;
  background: transparent;
  outline: none;
}
.chat-window-input-section > button {
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
}
.chat-window-input-section > button > i {
  width: 18px;
  height: 18px;
}
`;
document.head.append(styles);

const vitepressKnowledgeUrl = `https://github.com/aklinker1/vitepress-knowledge?ref=${location.hostname}-chat-window`;

let _mdToHtml;
const getMdToHtml = () => {
  if (!_mdToHtml) {
    const converter = new showdown.Converter();
    _mdToHtml = converter.makeHtml.bind(converter);
  }

  return _mdToHtml;
};

const lightingSvg = () => {
  const element = document.createElement("i");
  element.style.display = "block";
  element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143" clip-rule="evenodd"/></svg>`;
  return element;
};
const xMarkSvg = () => {
  const element = document.createElement("i");
  element.style.display = "block";
  element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg>`;
  return element;
};
const paperAirplaneSvg = () => {
  const element = document.createElement("i");
  element.style.display = "block";
  element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M2.87 2.298a.75.75 0 0 0-.812 1.021L3.39 6.624a1 1 0 0 0 .928.626H8.25a.75.75 0 0 1 0 1.5H4.318a1 1 0 0 0-.927.626l-1.333 3.305a.75.75 0 0 0 .811 1.022a24.9 24.9 0 0 0 11.668-5.115a.75.75 0 0 0 0-1.175A24.9 24.9 0 0 0 2.869 2.298"/></svg>`;
  return element;
};
const typingSpinnerSvg = () => {
  const element = document.createElement("i");
  element.style.display = "block";
  element.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_qM83{animation:spinner_8HQG 1.05s infinite}.spinner_oXPr{animation-delay:.1s}.spinner_ZTLf{animation-delay:.2s}@keyframes spinner_8HQG{0%,57.14%{animation-timing-function:cubic-bezier(0.33,.66,.66,1);transform:translate(0)}28.57%{animation-timing-function:cubic-bezier(0.33,0,.66,.33);transform:translateY(-6px)}100%{transform:translate(0)}}</style><circle class="spinner_qM83" fill="currentColor" cx="4" cy="12" r="3"/><circle class="spinner_qM83 spinner_oXPr" fill="currentColor" cx="12" cy="12" r="3"/><circle class="spinner_qM83 spinner_ZTLf" fill="currentColor" cx="20" cy="12" r="3"/></svg>`;
  return element;
};

const askAiButton = () => {
  const button = document.createElement("button");
  button.classList.add("ask-ai-btn", "chat-btn");
  const text = document.createElement("span");
  text.textContent = "Ask AI";
  button.append(lightingSvg(), text);

  button.onclick = () => {
    document.body.append(chatWindow());
    document.body.style.overflow = "hidden";
  };

  return button;
};

function chatWindow() {
  const overlay = document.createElement("div");
  overlay.classList.add("chat-window-overlay");
  const closeChatWindow = () => {
    overlay.remove();
    delete document.body.style.overflow;
  };
  overlay.onclick = (event) => {
    event.stopPropagation();
    closeChatWindow();
  };

  const chatWindow = document.createElement("div");
  chatWindow.classList.add("chat-window");
  chatWindow.onclick = (event) => {
    event.stopPropagation();
  };

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("chat-window-title-section");
  const titleIcon = lightingSvg();
  titleIcon.classList.add("icon");
  const titleSpan = document.createElement("p");
  titleSpan.classList.add("title");
  titleSpan.textContent = "Ask AI";
  const closeButton = document.createElement("button");
  const closeIcon = xMarkSvg();
  closeButton.append(closeIcon);
  closeButton.onclick = () => closeChatWindow();
  titleDiv.append(titleIcon, titleSpan, closeButton);

  let messages = [];
  const sendMessage = async () => {
    const content = textarea.value.trim();
    if (!content) return;

    textarea.value = "";
    inputDiv.disabled = true;
    textarea.disabled = true;
    sendButton.disabled = true;

    const newMessage = { role: "user", content };
    messages.push(newMessage);
    renderMessages();

    try {
      const res = await fetch("http://localhost:5174/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini-2.0-flash",
          messages,
        }),
      });
      if (res.status === 200) {
        messages = await res.json();
        renderMessages();
      } else {
        console.error("Failed to send message", res, await res.text());
      }
    } finally {
      inputDiv.removeAttribute("disabled");
      textarea.removeAttribute("disabled");
      sendButton.removeAttribute("disabled");
    }
  };

  const messagesDiv = document.createElement("div");
  messagesDiv.classList.add("chat-window-messages-section");
  const messagesContainer = document.createElement("div");
  messagesContainer.innerHTML = `
    <small class="powered-by">
      Powered by
      <a class="chat-link" href="${vitepressKnowledgeUrl}" target="_blank">vitepress-knowledge</a>
      &bull;
      <a class="chat-link" href="{{ DOMAIN }}/privacy-policy" target="_blank">Privacy Policy</a>
    </small>
    <div class="chat-message assistant">
      {{ WELCOME_MESSAGE }}
    </div>
  `;
  messagesDiv.append(messagesContainer);
  const renderMessage = (message) => {
    const div = document.createElement("div");
    div.classList.add("chat-message", message.role, "markdown");
    div.innerHTML = getMdToHtml()(message.content);
    return div;
  };
  const renderMessages = () => {
    messagesContainer.innerHTML = "";
    messagesContainer.append(...messages.map(renderMessage));

    if (messages.length % 2 === 1) {
      const loading = typingSpinnerSvg();
      messagesContainer.append(loading);
    }
  };

  const inputDiv = document.createElement("div");
  inputDiv.classList.add("chat-window-input-section");

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Ask a question...";
  textarea.onkeydown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };
  const sendButton = document.createElement("button");
  sendButton.classList.add("chat-btn");
  sendButton.append(paperAirplaneSvg());
  sendButton.onclick = () => {
    sendMessage();
  };
  inputDiv.append(textarea, sendButton);

  chatWindow.append(titleDiv, messagesDiv, inputDiv);
  overlay.append(chatWindow);
  setTimeout(() => textarea.focus());

  return overlay;
}

document.body.append(askAiButton());
