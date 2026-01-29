document.addEventListener('DOMContentLoaded', function () {
    // Rotina Para modo noturno
    const inputCheck = document.querySelector("#modo-noturno");
    const body = document.querySelector("body");
    // const nav = document.querySelector("nav.navbar"); // Navbar já é selecionada pelo Bootstrap via 'data-bs-theme' no body

    // Função para aplicar o tema salvo no localStorage
    function aplicarTemaSalvo() {
        const temaSalvo = localStorage.getItem('theme');
        if (temaSalvo) {
            body.setAttribute("data-bs-theme", temaSalvo);
            if (inputCheck) {
                inputCheck.checked = (temaSalvo === 'dark');
                const label = document.querySelector("label[for='modo-noturno']");
                if (label) label.textContent = inputCheck.checked ? 'Dark' : 'Light';
            }
        } else {
            // Define um tema padrão se nada estiver salvo (opcional, Bootstrap cuida disso)
            // ou verifica a preferência do sistema
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const defaultTheme = prefersDark ? 'dark' : 'light';
            body.setAttribute("data-bs-theme", defaultTheme);
             if (inputCheck) {
                inputCheck.checked = prefersDark;
                const label = document.querySelector("label[for='modo-noturno']");
                if (label) label.textContent = inputCheck.checked ? 'Dark' : 'Light';
            }
        }
    }

    // Função para mudar o modo e salvar no localStorage
    function alternarModo() {
        if (inputCheck && body) {
            const modo = inputCheck.checked ? 'dark' : 'light';
            body.setAttribute("data-bs-theme", modo);
            localStorage.setItem('theme', modo); // Salva a preferência
            const label = document.querySelector("label[for='modo-noturno']");
            if (label) label.textContent = inputCheck.checked ? 'Dark' : 'Light';

            // Bootstrap 5.3+ lida com a navbar automaticamente se ela tiver classes como `navbar-light bg-light` ou `navbar-dark bg-dark`
            // e o `data-bs-theme` for alterado no `<body>` ou em um ancestral da navbar.
            // O CSS customizado acima já lida com as cores específicas da navbar no modo escuro.
        }
    }

    // Aplica o tema salvo ao carregar a página
    aplicarTemaSalvo();

    // Adiciona o listener para o clique no checkbox
    if (inputCheck) {
        inputCheck.addEventListener('click', alternarModo);
    }

    // Script para acionar Popover (se você for usar) - Conforme documentação do Bootstrap
    // var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    // var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    //  return new bootstrap.Popover(popoverTriggerEl)
    // })


    // Smooth scroll para links de navegação
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Remove a classe 'active' de todos os links
            navLinks.forEach(internalLink => internalLink.classList.remove('active'));
            // Adiciona 'active' ao link clicado
            this.classList.add('active');

            let targetId = this.getAttribute('href');
            // Se for o link "Home" que aponta para #inicio e não houver #inicio, vá para o topo.
            if (targetId === '#inicio' && !document.getElementById('inicio')) {
                targetId = '#'; // Usará o comportamento padrão para # ou rolará para o topo
            }
            
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault(); // Previne o comportamento padrão apenas se o alvo existir

                // Fecha o menu hamburguer se estiver aberto (em telas menores)
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarToggler && navbarCollapse && navbarCollapse.classList.contains('show')) {
                    if (!navbarToggler.classList.contains('collapsed')) {
                         navbarToggler.click();
                    }
                }
                
                // Ajuste do scroll para considerar a altura do navbar fixo
                const navbarHeight = document.querySelector('.navbar.fixed-top')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            } else if (targetId === '#') {
                 e.preventDefault();
                 window.scrollTo({ top: 0, behavior: 'smooth'});
            }
        });
    });

    // Atualiza o link ativo no menu ao rolar a página
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        const navbarHeight = document.querySelector('.navbar.fixed-top')?.offsetHeight || 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 20; // Adiciona um pequeno buffer
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        // Lógica especial para a primeira seção ou topo da página
        if (window.scrollY < (document.getElementById(sections[0]?.id)?.offsetTop || 0) - navbarHeight - 20) {
             current = 'inicio'; // ou o ID da sua primeira seção se for diferente
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
         // Se nenhum 'current' for definido (está no topo antes da primeira seção), ativa 'Home'
        if (!current && navLinks[0] && navLinks[0].getAttribute('href') === '#inicio') {
            navLinks[0].classList.add('active');
        }
    });

});