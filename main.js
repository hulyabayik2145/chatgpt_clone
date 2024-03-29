const chatInput = document.querySelector("#chat-input");
//console.log(chatInput);
const sendButton = document.querySelector("#send-btn");
//console.log(sendButton);
let userText = null;
const chatContainer = document.querySelector(".chat-container");
//console.log(chatContainer);
const themeButton = document.querySelector("#theme-btn");
//console.log(themeButton);
const deleteButton = document.querySelector("#delete-btn");
console.log(deleteButton);
const initialHeight = chatInput.scrollHeight;

const API_KEY = "API_KEY";//buraya api_key inizi yazmalısınız.
//sayfa yüklendiğinde yerel depodan (localStorage) veri yükler.

const loadDataFromLocalStorage = () => {
    //tema rengini kontrol eder ve geçerli temayı uygular
    const themeColor = localStorage.getItem("theme-color");
    document.body.classList.toggle("light-mode",themeColor === "light_mode");
    //tema rengini yerel depoda günceller
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") 
    ? "dark_mode"
    : "light_mode";

    //sohbet içeriğini yerel depodan alır, varsayılan içeriği uygular.
    const defaultText = `
    <div class="default-text">
    <h1>ChatGPT Clone</h1>
    </div>
    `;
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    //sayfayı sohbetin en altına kaydırır.
    chatContainer.scrollTo(0, chatContainer.scrollHeight);


};
loadDataFromLocalStorage();


const createElement = (html,className) => {
    //yeni div olusturma ve belirtilen chat sınıfını ekleme
    //divin html içeriğimi ayarlama.
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat",className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    
    const pElement = document.createElement("p");

    //api talebi için özelliklerini ve verileri tanımlama
    const requestOptions = {
        method:"POST",
        headers: {
            "Content-Type":"application/json",
            Authorization:`Bearer ${API_KEY}`,

        },
        body:JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1, 
            stop: null,
        }),
    };

    try {
    const response =  await (await fetch(API_URL, requestOptions)).json();
   // console.log(response);
   pElement.textContent = response.choices[0].text.trim();
    
   } catch (error) {
    console.log(error);
    pElement.textContent = "Opppss";
    pElement.style.color="red";
   }
   incomingChatDiv.querySelector(".typing-animation").remove();
   incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
   chatContainer.scrollTo(0,chatContainer.scrollHeight);
   localStorage.setItem("all-chats",chatContainer.innerHTML);

   };






const showTypinganmation = () =>{
    const html = `   
    <div class="chat-content">
       <div class="chat-details">
           <img src="images/chatbot.jpg" alt="chat-images">
           <div class="typing-animation">
               <div class="typing-dot" style="--delay:0.2s"></div>
               <div class="typing-dot" style="--delay:0.3s"></div>
               <div class="typing-dot" style="--delay:0.4s"></div>
           </div>
       </div>
       <span class="material-symbols-outlined">
           content_copy
       </span>
   </div>`;
   const incomingChatDiv = createElement(html, "incoming");
   chatContainer.appendChild(incomingChatDiv);
   chatContainer.scrollTo(0,chatContainer.scrollHeight);
   getChatResponse(incomingChatDiv);
};

const handleOutGoingChat = () => {
    userText = chatInput.value.trim(); //chat input değerini alır,başındaki ve sonundaki boşlukları siler.
    //console.log(userText)
    if(!userText) return; //chatİnputun içi boş ise çalışmasın
    const html = `<div class="chat-content">
       <div class="chat-details">
           <img src="images/user.jpg" alt="user-images" />
           <p>
            ${userText}
               </p>
       </div>
   </div>`;
   const outgoingChatDiv = createElement(html, "outgoing");
   outgoingChatDiv.querySelector("p").textContent = userText;
   document.querySelector(".default-text")?.remove();
   chatContainer.appendChild(outgoingChatDiv);
   chatContainer.scrollTo(0,chatContainer.scrollHeight);
   setTimeout(showTypinganmation,500);
   
   
  
};

  themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeButton.innerText = document.body.classList.contains("light-mode")
   localStorage.setItem("theme-color", themeButton.innerText);
 themeButton.innerText = document.body.classList.contains("light-mode") 
 ? "dark_mode"
 : "light_mode";
});
deleteButton.addEventListener("click", () => {
    if(confirm("tüm sohbetleri silmek istediğinizden emin misiniz?")){
        localStorage.removeItem("all-chats");
        loadDataFromLocalStorage();
    }

});

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e)=>{
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutGoingChat();

    }
});

sendButton.addEventListener("click", handleOutGoingChat);
