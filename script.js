// script.js - Funcionalidades de Tema e Idioma para Portfolio Clean

// Sistema de Tema Escuro/Claro
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Verificar tema salvo ou usar light como padrão
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    themeToggle.setAttribute('aria-label', 'Alternar para tema claro');
  } else {
    document.body.classList.remove('dark-theme');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    themeToggle.setAttribute('aria-label', 'Alternar para tema escuro');
  }
  
  // Aplicar cores específicas para ícones
  updateIconsForTheme();
}

// Sistema de Idioma Português/Inglês/Alemão
const languageToggle = document.getElementById('languageToggle');
const langIcon = languageToggle.querySelector('.lang-icon');
const langText = languageToggle.querySelector('.lang-text');

// Mapeamento de idiomas (código → configurações)
const languages = {
  'pt': {
    code: 'pt',
    name: 'Português',
    flag: '🇧🇷',
    short: 'PT',
    next: 'en',
    aria: 'Mudar para Inglês'
  },
  'en': {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    short: 'EN',
    next: 'de',
    aria: 'Switch to German'
  },
  'de': {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    short: 'DE',
    next: 'pt',
    aria: 'Wechseln zu Portugiesisch'
  }
};

// Ordem de prioridade para detecção automática
const languagePriority = ['pt', 'en', 'de'];

// Verificar idioma salvo ou usar preferência do navegador
let savedLanguage = localStorage.getItem('language');
if (!savedLanguage) {
  // Detecta idioma do navegador
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.substring(0, 2).toLowerCase();
  
  // Verifica se o idioma detectado está disponível
  if (languages[langCode]) {
    savedLanguage = langCode;
  } else {
    // Se não estiver disponível, usa o primeiro da lista de prioridade
    savedLanguage = languagePriority[0];
  }
}

// Inicializar com o idioma salvo
applyLanguage(savedLanguage);

languageToggle.addEventListener('click', () => {
  const currentLang = document.documentElement.lang;
  const currentLangObj = languages[currentLang];
  const newLang = currentLangObj.next;
  applyLanguage(newLang);
  localStorage.setItem('language', newLang);
});

function applyLanguage(lang) {
  const langObj = languages[lang];
  
  if (!langObj) {
    console.error(`Idioma "${lang}" não suportado. Usando "en" como fallback.`);
    lang = 'en';
  }
  
  // Atualizar atributo lang do HTML
  document.documentElement.lang = lang;
  
  // Salvar posição do scroll antes da atualização
  const scrollPosition = window.scrollY;
  
  // Atualizar todos os elementos com data attributes
  document.querySelectorAll('[data-en], [data-pt], [data-de]').forEach(element => {
    const textPt = element.getAttribute('data-pt');
    const textEn = element.getAttribute('data-en');
    const textDe = element.getAttribute('data-de');
    
    // Determinar qual texto usar baseado no idioma atual
    let newText = '';
    switch (lang) {
      case 'pt':
        newText = textPt || textEn || textDe || '';
        break;
      case 'en':
        newText = textEn || textPt || textDe || '';
        break;
      case 'de':
        newText = textDe || textEn || textPt || '';
        break;
    }
    
    if (newText) {
      // Para elementos que têm texto (não são inputs/imagens)
      if (!['INPUT', 'TEXTAREA', 'IMG'].includes(element.tagName)) {
        element.textContent = newText;
      }
      // Para imagens com alt
      else if (element.tagName === 'IMG' && element.hasAttribute('alt')) {
        element.setAttribute('alt', newText);
      }
      // Para inputs com placeholder
      else if (element.hasAttribute('placeholder')) {
        element.setAttribute('placeholder', newText);
      }
      // Para inputs com value (botões)
      else if (element.hasAttribute('value')) {
        element.setAttribute('value', newText);
      }
    }
  });
  
  // Atualizar botão de idioma
  langIcon.textContent = langObj.flag;
  langText.textContent = langObj.short;
  languageToggle.setAttribute('aria-label', langObj.aria);
  
  // Restaurar posição do scroll
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollPosition);
  });
  
  // Atualizar título da página se existir data attribute
  const titleElement = document.querySelector('title');
  if (titleElement && titleElement.hasAttribute('data-pt') && titleElement.hasAttribute('data-en') && titleElement.hasAttribute('data-de')) {
    switch (lang) {
      case 'pt':
        titleElement.textContent = titleElement.getAttribute('data-pt');
        break;
      case 'en':
        titleElement.textContent = titleElement.getAttribute('data-en');
        break;
      case 'de':
        titleElement.textContent = titleElement.getAttribute('data-de');
        break;
    }
  }
  
  // Log para debugging
  console.log(`🌐 Idioma alterado para: ${langObj.name} (${langObj.code})`);
}

// Ajustar ícones específicos baseados no tema
function updateIconsForTheme() {
  const isDarkTheme = document.body.classList.contains('dark-theme');
  
  // Ajustar ícone do GitHub
  document.querySelectorAll('.github-white').forEach(icon => {
    if (isDarkTheme) {
      icon.style.filter = 'brightness(0) invert(1)';
    } else {
      icon.style.filter = 'brightness(0)';
    }
  });
  
  // Ajustar tema dos ícones de contato
  document.querySelectorAll('.contact-icon').forEach(icon => {
    if (isDarkTheme) {
      if (icon.classList.contains('email-icon')) {
        icon.style.color = '#f0f0f0';
      } else if (icon.classList.contains('linkedin-icon')) {
        icon.style.color = '#0ea5e9';
      } else if (icon.classList.contains('github-icon')) {
        icon.style.color = '#f0f0f0';
      }
    } else {
      if (icon.classList.contains('email-icon')) {
        icon.style.color = '#d44638';
      } else if (icon.classList.contains('linkedin-icon')) {
        icon.style.color = '#0077b5';
      } else if (icon.classList.contains('github-icon')) {
        icon.style.color = '#333';
      }
    }
  });
  
  // Ajustar cores dos ícones de skills baseados no tema
  document.querySelectorAll('.skill-icon').forEach(icon => {
    if (isDarkTheme) {
      // Para ícones de font-awesome
      if (icon.classList.contains('sql-icon')) {
        icon.style.color = '#4dc0ff';
      } else if (icon.classList.contains('metrology-icon')) {
        icon.style.color = '#4dc0ff';
      } else if (icon.classList.contains('deploy-icon')) {
        icon.style.color = '#ffb366';
      }
    } else {
      // Restaurar cores originais no tema claro
      if (icon.classList.contains('sql-icon')) {
        icon.style.color = '#00758f';
      } else if (icon.classList.contains('metrology-icon')) {
        icon.style.color = '#0088cc';
      } else if (icon.classList.contains('deploy-icon')) {
        icon.style.color = '#ff6b00';
      }
    }
  });
}

// Observar mudanças no tema para atualizar ícones
const observer = new MutationObserver(() => {
  updateIconsForTheme();
});
observer.observe(document.body, { 
  attributes: true, 
  attributeFilter: ['class'] 
});

// Inicializar ícones
updateIconsForTheme();

// Detectar preferência de tema do sistema (opcional)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  // Só muda automaticamente se o usuário não tiver escolhido um tema
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

// Adicionar animação de entrada para elementos
document.addEventListener('DOMContentLoaded', () => {
  // Animar elementos ao carregar
  const animateElements = () => {
    const elements = document.querySelectorAll('.card, .profile-mini, h2');
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100 * index);
    });
  };
  
  // Executar animação após um pequeno delay
  setTimeout(animateElements, 300);
  
  // Log para debugging
  console.log('✅ Portfolio carregado com sucesso!');
  console.log(`🎨 Tema atual: ${localStorage.getItem('theme') || 'light (padrão)'}`);
  const currentLang = document.documentElement.lang;
  const langObj = languages[currentLang];
  console.log(`🌐 Idioma atual: ${langObj ? langObj.name : currentLang} (${currentLang})`);
  console.log('🚀 Funcionalidades ativas: Tema Dark/Light e Troca de Idioma PT/EN/DE');
});

// Prevenir comportamento padrão de links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Adicionar efeito de hover nos cards com delay
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});