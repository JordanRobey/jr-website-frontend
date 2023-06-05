  import * as ContactPage from './modules/contact.js';
  import * as BlogPage from './modules/blog.js';
  import * as HomePage from './modules/home.js';
  import './components/header.js'; 
  import './components/footer.js'; 

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
        HomePage.initializeHomePage();
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
    var baseDir = "";
  
    // Check if running on GitHub Pages
    if (window.location.hostname === "jordanrobey.github.io") {
      baseDir = "/jr-website-frontend";
    }
  
    // Check if running on Live Server
    if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
      baseDir = "/frontend";
    }
  
    var pages = {
      "home": baseDir + "/pages/home.html",
      "blog": baseDir + "/pages/blog.html",
      "contact": baseDir + "/pages/contact.html",
      "blog-post": baseDir + "/pages/blogPost.html"
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
