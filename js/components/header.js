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
          <div class="links-block">
          <a class="pro-links" href="https://www.linkedin.com/in/jordan-robey/" target="_blank">
            LinkedIn
          </a>
          <a class="pro-links" href="https://github.com/jordanrobey" target="_blank">
            GitHub
          </a>
          </div>
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
                background-color: #e9e9e9;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .links-block {
              margin-bottom: 1rem;
            }
            .pro-links {
              text-decoration: none;
              color: blue;
              margin-bottom: 1rem;
              margin-top: 1rem;
            }
              
            header h1 {
                font-size: 1.7rem;
                font-weight: 600;
                color: #333;

                margin-top: .5rem;
            }
            header nav ul {
                display: flex;
                list-style: none;
                margin: 0;
                margin-bottom: 1rem;
                font-size: 1.4rem;
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
              text-decoration: underline;
                color: #000;
            }
        </style>

      `;
  
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
  
  customElements.define('header-component', Header);