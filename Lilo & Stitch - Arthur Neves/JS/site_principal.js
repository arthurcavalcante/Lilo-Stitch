/**
 * Lilo & Stitch - Interatividade e Comportamentos Front-End
 * Funcionalidades: Alternância de Tema Claro/Escuro, Scrollspy, Validação de Formulário, UX de Áudio
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // =========================================================================
    // 1. Alternância de Modo Claro / Escuro (Dark Mode) com Persistência
    // =========================================================================
    const inputCheck = document.querySelector("#modo-noturno");
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const themeLabelText = document.querySelector(".theme-label-text");
    const themeIcon = document.querySelector(".theme-icon");

    function aplicarTema(tema) {
        // Bootstrap 5.3 suporta data-bs-theme no <html> ou <body>
        htmlElement.setAttribute("data-bs-theme", tema);
        bodyElement.setAttribute("data-bs-theme", tema);
        localStorage.setItem('theme', tema);

        const isDark = (tema === 'dark');
        if (inputCheck) {
            inputCheck.checked = isDark;
        }

        if (themeLabelText) {
            themeLabelText.textContent = isDark ? 'Dark' : 'Light';
        }

        if (themeIcon) {
            if (isDark) {
                themeIcon.className = 'bi bi-moon-stars-fill theme-icon me-1 text-warning';
            } else {
                themeIcon.className = 'bi bi-sun-fill theme-icon me-1 text-warning';
            }
        }
    }

    function inicializarTema() {
        const temaSalvo = localStorage.getItem('theme');
        if (temaSalvo === 'dark' || temaSalvo === 'light') {
            aplicarTema(temaSalvo);
        } else {
            const prefereDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            aplicarTema(prefereDark ? 'dark' : 'light');
        }
    }

    if (inputCheck) {
        inputCheck.addEventListener('change', function () {
            const novoTema = this.checked ? 'dark' : 'light';
            aplicarTema(novoTema);
        });
    }

    // Ouvir mudança nas preferências do sistema operacional
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem('theme')) {
            aplicarTema(e.matches ? 'dark' : 'light');
        }
    });

    inicializarTema();

    // =========================================================================
    // 2. Navegação Suave e Fechamento Automático do Menu Mobile
    // =========================================================================
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                // Fecha o menu hamburguer se estiver expandido em dispositivos móveis
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    if (navbarToggler) {
                        navbarToggler.click();
                    }
                }

                // Scroll suave levando em conta a altura dinâmica da barra de navegação
                const navbarHeight = document.querySelector('.navbar.fixed-top')?.offsetHeight || 76;
                const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementTop - navbarHeight + 2;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Atualizar o foco para acessibilidade
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
            }
        });
    });

    // =========================================================================
    // 3. Scrollspy: Destaque do Link Ativo da Seção Visível
    // =========================================================================
    const sections = document.querySelectorAll('section[id]');
    
    function atualizarLinkAtivo() {
        const scrollPosition = window.scrollY + 120;
        let secaoAtiva = '';

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                secaoAtiva = section.getAttribute('id');
            }
        });

        // Caso esteja bem no topo da página
        if (window.scrollY < 100 && sections.length > 0) {
            secaoAtiva = sections[0].getAttribute('id');
        }

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#' + secaoAtiva) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', atualizarLinkAtivo, { passive: true });
    atualizarLinkAtivo();

    // =========================================================================
    // 4. Controle de Áudio Inteligente (Pausar outras faixas ao reproduzir uma)
    // =========================================================================
    const audioPlayers = document.querySelectorAll('audio');

    audioPlayers.forEach(player => {
        player.addEventListener('play', function () {
            audioPlayers.forEach(outroPlayer => {
                if (outroPlayer !== player && !outroPlayer.paused) {
                    outroPlayer.pause();
                }
            });
        });
    });

    // =========================================================================
    // 5. Validação e Envio do Formulário de Contato (Offcanvas)
    // =========================================================================
    const formContato = document.getElementById('formContato');
    const formFeedback = document.getElementById('formFeedback');

    if (formContato) {
        formContato.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!formContato.checkValidity()) {
                formContato.classList.add('was-validated');
                return;
            }

            // Sanitização básica das entradas
            const nomeInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const mensagemInput = document.getElementById('contactMessage');

            const nomeLimpo = nomeInput ? nomeInput.value.trim() : '';

            // Feedback visual seguro via nós DOM (evitando innerHTML de dados de entrada)
            if (formFeedback) {
                formFeedback.innerHTML = ''; // Limpa mensagens anteriores
                
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3';
                alertDiv.setAttribute('role', 'alert');

                const icon = document.createElement('i');
                icon.className = 'bi bi-check-circle-fill fs-5 me-2';
                icon.setAttribute('aria-hidden', 'true');

                const contentSpan = document.createElement('span');
                contentSpan.innerHTML = `<strong>Mahalo, ${escapeHtml(nomeLimpo)}!</strong> Sua mensagem foi enviada com sucesso com espírito de Ohana! 🌺`;

                const closeBtn = document.createElement('button');
                closeBtn.type = 'button';
                closeBtn.className = 'btn-close';
                closeBtn.setAttribute('data-bs-dismiss', 'alert');
                closeBtn.setAttribute('aria-label', 'Fechar aviso');

                alertDiv.appendChild(icon);
                alertDiv.appendChild(contentSpan);
                alertDiv.appendChild(closeBtn);

                formFeedback.appendChild(alertDiv);
            }

            // Limpa os campos do formulário
            formContato.reset();
            formContato.classList.remove('was-validated');
        });
    }

    // Função auxiliar para escapar caracteres especiais e prevenir XSS
    function escapeHtml(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    // =========================================================================
    // 6. Atualização Automática do Ano no Rodapé
    // =========================================================================
    const anoAtualElement = document.getElementById('ano-atual');
    if (anoAtualElement) {
        anoAtualElement.textContent = new Date().getFullYear();
    }
});
