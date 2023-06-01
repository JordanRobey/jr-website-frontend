class Header extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      const template = document.createElement('template');
      template.innerHTML = `
        <header>
          <h1>Jordan Robey</h1>
          <nav>
            <ul>
              <li><a id="home-link" href=#home>Home</a></li> 
              <li><a id="blog-link" href=#blog>Blog</a></li>
              <li><a id="contact-link" href=#contact>Contact</a></li>
            </ul>
          </nav>
        </header>

        <style>
            header {
                display: flex;
                flex-direction: column;;
                justify-content: center;
                align-items: center;
                padding: 0 2rem;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            header h1 {
                font-size: 1.5rem;
                font-weight: 600;
                color: #333;
            }
            header nav ul {
                display: flex;
                list-style: none;
                margin: 0;
                padding: 0;
            }
            header nav ul li {
                margin-right: 1rem; /* Add space between the li elements */
              }
      
              header nav ul li:last-child {
                margin-right: 0; /* Remove the right margin for the last li element */
              }
            header nav ul li a {
                text-decoration: none;
                color: #333;
                font-weight: 600;
            }
            header nav ul li a:hover {
                color: #000;
            }
        </style>

      `;
  
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
  
  customElements.define('header-component', Header);
  
  

  class Footer extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      const template = document.createElement('template');
      template.innerHTML = `
        <footer>
          <p>&copy; 2023 Your Company. All rights reserved.</p>
        </footer>
  
        <style>
          footer {
            background-color: #f5f5f5;
            padding: 1rem;
            text-align: center;
          }
  
          p {
            color: #666;
            font-size: 0.8rem;
            margin: 0;
          }
        </style>
      `;
  
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
  
  customElements.define('footer-component', Footer);

  import * as ContactPage from './modules/contact.js';
  import * as BlogPage from './modules/blog.js';

  window.addEventListener("hashchange", loadContent); 

  function loadContent() {
    var contentDiv = document.getElementById("app");
    var hash = location.hash.substring(1);
    if (hash.startsWith('blog-post/')) {
      hash = hash.split('/')[0];
    }
  
    getContent(hash)
      .then(htmlContent => {
        contentDiv.innerHTML = htmlContent}).then(()=>{
          console.log(hash)
          initializePageFunctionality(hash);
        })
      .catch(error => {
        console.error('Error loading content:', error);
      });
  }
  
  if (!location.hash) {
    location.hash = "#home";
  }

  function getContent(hash) {
    return getHTMLFile(hash)
      .then(htmlContent => {
        return htmlContent;
      })
      .catch(error => {
        console.error('Error loading content:', error);
      });
  }

  function initializePageFunctionality(hash) {
    switch (hash) {
      case 'home':
        break;
      case 'blog':
        BlogPage.initializeBlogPage();
        break;
      case 'blog-post':
        BlogPage.initializeBlogPostPage();
        break;
      case 'contact':
        ContactPage.initializeContactPage();
        break;
    }
  }

  function getHTMLFile(hash) {

    var pages = {
      "home": "/frontend/pages/home.html",
      "blog": "/frontend/pages/blog.html",
      "contact": "/frontend/pages/contact.html",
      "blog-post": "/frontend/pages/blogPost.html"
    };
    var filePath = pages[hash];
    return fetch(filePath)
      .then(response => {
        return response.text();
      })
      .catch(error => {
        console.warn(error);
      });
  }
  
  loadContent();
