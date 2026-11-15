import { linguaAtual, traducoes } from "./traducao.js";

// Hamburger Menu
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".sidebar");
const hamburger = document.querySelector(".hamburger-menu");
const menuLinks = document.querySelectorAll(".sidebar a");

// Fecha ao clicar em um item
menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        menuToggle.checked = false;
    });
});

// Fecha ao clicar fora da sidebar e do hamburger
document.addEventListener("click", (event) => {
    if (menuToggle.checked && !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
        menuToggle.checked = false;
    }
});

// Modal
const etecLink = document.getElementById("etec-link");
const etecModal = document.getElementById("etec-modal");
const closeModal = document.getElementById("close-modal");

const modalImage = document.getElementById("modal-image");
const imageCaption = document.getElementById("image-caption");
const imageCounter = document.getElementById("image-counter");

const prevImage = document.getElementById("prev-image");
const nextImage = document.getElementById("next-image");

const etecImages = [
    {
        src: "arquivos/etec/foto-1.png",
        captionPt: "Organizadores e participantes",
        captionEn: "Organizers and participants"
    }, {
        src: "arquivos/etec/foto-2.png",
        captionPt: "Fliperama retrô",
        captionEn: "Retro arcade machine",
    }, {
        src: "arquivos/etec/foto-3.png",
        captionPt: "Fliperama retrô",
        captionEn: "Retro arcade machine",
    }, {
        src: "arquivos/etec/foto-4.png",
        captionPt: "Caixa de areia com realidade aumentada",
        captionEn: "Augmented reality sandbox"
    }, {
        src: "arquivos/etec/foto-5.png",
        captionPt: "Quiz",
        captionEn: "Quiz"
    }, {
        src: "arquivos/etec/foto-6.png",
        captionPt: "Demonstração de drones",
        captionEn: "Drone demonstration"
    }, {
        src: "arquivos/etec/foto-7.png",
        captionPt: "Vulcão de papel machê",
        captionEn: "Papier-mâché volcano"
    }, {
        src: "arquivos/etec/foto-8.png",
        captionPt: "Constelação virtual",
        captionEn: "Virtual constellation"
    }, {
        src: "arquivos/etec/foto-9.png",
        captionPt: "Impressões 3D",
        captionEn: "3D printing"
    }
];

let currentImage = 0;

function showImage(i) {
    const image = etecImages[i];
    modalImage.src = etecImages[i].src;
    const caption = linguaAtual === "pt" ? image.captionPt : image.captionEn;
    modalImage.alt = caption;
    imageCaption.textContent = caption;
    imageCounter.textContent = `${i+1} / ${etecImages.length}`;
}

function prevSlide() {
    currentImage--;
    if(currentImage < 0) {
        currentImage = etecImages.length - 1;
    }
    showImage(currentImage);
}

function nextSlide() {
    currentImage++;
    if(currentImage >= etecImages.length) {
        currentImage = 0;
    }
    showImage(currentImage);
}

etecLink.addEventListener("click", (e) => {
    e.preventDefault();
    currentImage = 0;
    showImage(currentImage);
    etecModal.classList.add("active");
});

closeModal.addEventListener("click", () => {
    etecModal.classList.remove("active");
});

nextImage.addEventListener("click", nextSlide);
prevImage.addEventListener("click", prevSlide);

etecModal.addEventListener("click", (e) => {
    if(e.target === etecModal) {
        etecModal.classList.remove("active");
    }
});

document.addEventListener("keydown", (e) => {
    if(!etecModal.classList.contains("active")) return;

    if(e.key === "Escape") {
        etecModal.classList.remove("active");
    }

    if(e.key === "ArrowRight") {
        nextSlide();
    }

    if(e.key === "ArrowLeft") {
        prevSlide();
    }
});

// Enviar mensagem
const form = document.querySelector("form");
const resultado = document.getElementById("resultado-envio");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resultado.textContent = traducoes[linguaAtual].sending;

    const dados = Object.fromEntries(new FormData(form).entries());

    try {
        const resposta = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const texto = await resposta.text();

        console.log("Status HTTP:", resposta.status);
        console.log("Resposta original:", texto);

        let respostaJson;

        try {
            respostaJson = JSON.parse(texto);
        } catch {
            throw new Error("Resposta não é um JSON válido");
        }

        if(resposta.ok && respostaJson.success) {
            resultado.textContent = traducoes[linguaAtual].success;
            form.reset();
        } else {
            resultado.textContent = traducoes[linguaAtual].error;
            console.error("Erro na resposta:", respostaJson);
        }
    } catch (error) {
        console.error("Error:", error);
        resultado.textContent = traducoes[linguaAtual].error;
    }
});