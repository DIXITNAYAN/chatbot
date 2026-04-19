// Page load animation
// Page load animation
window.onload = () => {
  gsap.from(".sidebar", {
    x: -100,
    opacity: 0,
    duration: 1
  });

  gsap.from(".chat-section", {
    opacity: 0,
    duration: 1,
    delay: 0.5
  });
};

// Send message function
async function sendMessage() {
  const input = document.getElementById("input");
  const chatBox = document.getElementById("chat-box");

  const text = input.value.trim();
  if (!text) return;

  // USER MESSAGE
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.innerText = text;
  chatBox.appendChild(userMsg);

  gsap.from(userMsg, {
    x: 100,
    opacity: 0,
    duration: 0.4
  });

  // BOT TYPING
  const typing = document.createElement("div");
  typing.className = "message bot";
  typing.id = "typing";
  typing.innerText = "Typing...";
  chatBox.appendChild(typing);

  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("https://chatbot-backend-1-wk3v.onrender.com/bot/v1/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    // check response
    if (!res.ok) {
      throw new Error("API error");
    }

    const data = await res.json();
    console.log("API response:", data);

    typing.remove();

    // BOT MESSAGE
    const botMsg = document.createElement("div");
    botMsg.className = "message bot";

    // safe display
    botMsg.innerText = data.reply || data.error || "No response";

    chatBox.appendChild(botMsg);

    gsap.from(botMsg, {
      x: -100,
      opacity: 0,
      duration: 0.4
    });

  } catch (err) {
    console.error(err);
    typing.remove();

    const errorMsg = document.createElement("div");
    errorMsg.className = "message bot";
    errorMsg.innerText = "Error 😕";
    chatBox.appendChild(errorMsg);
  }

  // clear input AFTER request
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Enter key support
document.getElementById("input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});