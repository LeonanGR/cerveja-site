document.addEventListener('DOMContentLoaded', function() {
  
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const menuIcon = document.getElementById('menu-icon');
  const navLinks = document.querySelectorAll('.nav-link');

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

  // fecha a barra lateral ao clicar em um link (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Verifica se a tela é menor que 768px
      if (window.innerWidth < 768) { 
        sidebar.classList.remove('open');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
      }
      
      // Lógica para marcar o link clicado como ativo
      // Remove a classe 'active' de todos os links de navegação
      navLinks.forEach(navLink => {
        navLink.classList.remove('active');
      });
      
      // Adiciona a classe 'active' apenas ao link que foi clicado
      this.classList.add('active');
    });
  });

  // Lógica de "Scroll Spy" para destacar o link de navegação ativo conforme o usuário rola a página
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    let currentSectionId = ''; // Variável para armazenar o ID da seção visível no momento

    sections.forEach(section => {
      const sectionTop = section.offsetTop; // Pega a distância do topo da seção em relação ao topo da página
      
      // Verifica se a posição de rolagem atual passou do topo da seção (com um pequeno deslocamento de 100px para melhor sensibilidade)
      if (window.scrollY >= (sectionTop - 100)) {
        currentSectionId = section.getAttribute('id'); // Armazena o ID da seção atual
      }
    });

    // Se uma seção atual foi identificada
    if (currentSectionId) {
      navLinks.forEach(link => { // Para cada link de navegação
        link.classList.remove('active'); // Remove a classe 'active'
        // Verifica se o atributo 'href' do link corresponde ao ID da seção atual
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active'); // Adiciona a classe 'active' ao link correspondente
        }
      });
    }
  });
});