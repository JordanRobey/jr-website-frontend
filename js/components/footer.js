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
          <p>&copy; 2023 Jordan Robey</p>
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