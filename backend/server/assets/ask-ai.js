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
  padding: 1rem 1.5rem 1rem 1rem;
  z-index: 1;
}
@media (min-width: 768px) {
  .ask-ai-btn {
    padding: 0.75rem 1.25rem 0.75rem 0.75rem;
  }
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
  border: none;
  opacity: 0;
  transition: 100ms ease-out;
}
.chat-window.loaded {
  opacity: 1;
  transform: scale(100%, 100%);
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
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    transition: 200ms ease;
    opacity: 1;
    transform: scale(100%, 100%);
    @starting-style {
      opacity: 0;
      transform: scale(110%, 110%);
    }
  }
}
`;
document.head.append(styles);

const lightingSvg = () => {
  const element = document.createElement("i");
  element.style.display = "block";
  element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143" clip-rule="evenodd"/></svg>`;
  return element;
};

const openChat = (initialMessages) => {
  document.body.append(chatWindow(initialMessages));
  document.body.style.overflow = "hidden";
};

const askAiButton = () => {
  const button = document.createElement("button");
  button.classList.add("ask-ai-btn", "chat-btn");
  const text = document.createElement("span");
  text.textContent = "Ask AI";
  button.append(lightingSvg(), text);

  button.onclick = () => openChat();

  return button;
};

function chatWindow(initialMessages) {
  const overlay = document.createElement("div");
  overlay.classList.add("chat-window-overlay");

  const closeChatWindow = () => {
    overlay.remove();
    document.body.style.removeProperty("overflow");
    window.removeEventListener("message", onMessage);
  };

  const onMessage = (event) => {
    if (event.data === "vitepress-knowledge:close-modal") {
      closeChatWindow();
    }
  };
  window.addEventListener("message", onMessage);

  overlay.onclick = (event) => {
    event.stopPropagation();
    closeChatWindow();
  };

  const chatWindow = document.createElement("iframe");
  chatWindow.classList.add("chat-window");
  const url = new URL("{{ SERVER_URL }}");
  url.searchParams.set("mode", "modal");
  if (initialMessages)
    url.searchParams.set("q", JSON.stringify(initialMessages));
  chatWindow.src = url.href;
  chatWindow.onload = () => {
    chatWindow.classList.add("loaded");
  };

  overlay.append(chatWindow);

  return overlay;
}

document.body.append(askAiButton());

try {
  const initialQuestion = new URLSearchParams(window.location.search).get("q");
  if (initialQuestion) {
    const initialMessages = JSON.parse(initialQuestion);
    if (initialMessages.length) {
      openChat(initialMessages);
    }
  }
} catch (err) {
  console.error(err);
}
