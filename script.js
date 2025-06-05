document.addEventListener('DOMContentLoaded', function() {
  
  // --- Lógica do Menu Lateral e Scroll Spy (existente) ---
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const menuIcon = document.getElementById('menu-icon');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && sidebar && menuIcon) { 
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      if (sidebar.classList.contains('open')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
      } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth < 768 && sidebar && menuIcon) { 
        sidebar.classList.remove('open');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
      }
      navLinks.forEach(navLink => navLink.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Adiciona um ouvinte de evento que é acionado sempre que o usuário rola a página.
  window.addEventListener('scroll', function() {
    // Seleciona todos os elementos <section> da página.
    // Estes são os alvos que o scroll spy irá monitorar.
    const sections = document.querySelectorAll('section'); 
    
    // Variável para armazenar o ID da seção que está atualmente visível na viewport.
    // É inicializada como uma string vazia.
    let currentSectionId = ''; 

    // Itera sobre cada seção encontrada.
    sections.forEach(section => { 
      // Obtém a distância do topo da seção em relação ao topo do documento.
      const sectionTop = section.offsetTop; 
      
      // Verifica se a posição atual de rolagem vertical da janela (window.scrollY)
      // ultrapassou o topo da seção atual.
      // O '- 100' cria um deslocamento (offset), fazendo com que a seção seja considerada "ativa"
      // um pouco antes de seu topo exato atingir o topo da viewport, melhorando a sensibilidade.
      if (window.scrollY >= (sectionTop - 100)) { 
        // Se a condição for verdadeira, armazena o atributo 'id' da seção atual.
        // Este ID será usado para destacar o link de navegação correspondente.
        currentSectionId = section.getAttribute('id'); 
      }
    });

    // Após verificar todas as seções, se um currentSectionId foi definido (ou seja, uma seção está "ativa").
    if (currentSectionId) { 
      // Itera sobre todos os links de navegação da barra lateral.
      navLinks.forEach(link => { 
        // Primeiro, remove a classe 'active' de todos os links para limpar o estado anterior.
        link.classList.remove('active'); 
        
        // Verifica se o valor do atributo 'href' do link (ex: "#receita")
        // corresponde ao ID da seção atual (prefixado com '#').
        if (link.getAttribute('href') === `#${currentSectionId}`) { 
          // Se corresponder, adiciona a classe 'active' a este link, destacando-o.
          link.classList.add('active'); 
        }
      });
    }
  });

  // --- Lógica do Lightbox para Imagens e Vídeos ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video'); 
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  
  let currentGalleryMedia = []; 
  let currentMediaIndex = 0;

  if (lightbox && lightboxImg && lightboxVideo && lightboxCaption && lightboxClose && lightboxPrev && lightboxNext) {
    const mediaToLightbox = document.querySelectorAll('.clickable-gallery-media'); 

    mediaToLightbox.forEach((mediaItem) => {
      mediaItem.addEventListener('click', function() {
        const parentSection = mediaItem.closest('section');
        if (parentSection) {
          currentGalleryMedia = Array.from(parentSection.querySelectorAll('.clickable-gallery-media'));
          currentMediaIndex = currentGalleryMedia.indexOf(mediaItem);
          openLightbox();
        }
      });
    });

    function openLightbox() {
      if (currentGalleryMedia.length > 0) {
        updateLightboxMedia();
        lightbox.style.display = 'flex'; 
        // eslint-disable-next-line no-unused-expressions
        lightbox.offsetHeight; 
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden'; 
      }
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightboxVideo.pause(); 
      lightboxVideo.src = "";  
      lightbox.addEventListener('transitionend', function handler() {
          if (!lightbox.classList.contains('open')) {
              lightbox.style.display = 'none';
          }
          lightbox.removeEventListener('transitionend', handler, { once: true });
      });
      document.body.style.overflow = ''; 
    }

    function updateLightboxMedia() {
      const mediaElement = currentGalleryMedia[currentMediaIndex];
      const mediaType = mediaElement.tagName.toLowerCase();

      if (mediaType === 'img') {
        lightboxImg.src = mediaElement.src;
        lightboxImg.style.display = 'block';
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.src = ""; 
        lightboxCaption.textContent = mediaElement.alt || '';
      } else if (mediaType === 'video') {
        lightboxVideo.src = mediaElement.src; 
        lightboxVideo.style.display = 'block';
        lightboxImg.style.display = 'none';
        lightboxVideo.load(); 
        lightboxCaption.textContent = mediaElement.dataset.caption || ''; // Será vazio se data-caption não existir
      }

      lightboxPrev.style.display = (currentMediaIndex === 0) ? 'none' : 'block';
      lightboxNext.style.display = (currentMediaIndex === currentGalleryMedia.length - 1) ? 'none' : 'block';
    }

    function showPrevMedia() {
      if (currentMediaIndex > 0) {
        currentMediaIndex--;
        lightboxVideo.pause(); 
        lightboxVideo.src = "";
        updateLightboxMedia();
      }
    }

    function showNextMedia() {
      if (currentMediaIndex < currentGalleryMedia.length - 1) {
        currentMediaIndex++;
        lightboxVideo.pause(); 
        lightboxVideo.src = "";
        updateLightboxMedia();
      }
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevMedia);
    lightboxNext.addEventListener('click', showNextMedia);

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) { 
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (lightbox.classList.contains('open')) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevMedia();
        } else if (e.key === 'ArrowRight') {
            showNextMedia();
        }
      }
    });

  } else {
    console.warn("Elementos do Lightbox (imagem, vídeo ou controles) não foram encontrados no DOM.");
  }
});