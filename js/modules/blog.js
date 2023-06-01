let state = {
    blogPost: {},
    blogPosts: []
  };

export function initializeBlogPage() {
     
    async function loadBlogPosts() {
      await getBlogPosts()
        .then(data => {
          state.blogPosts = data;
          return
        })
    }
  
    function getBlogPosts() {
      return fetch('http://127.0.0.1:5000/blog_posts', {
        method: 'GET',
      })
        .then(response => {
          return response.json();
        })
        .catch(error => {
          console.error('Error fetching blog posts:', error);
        });
    }
  
    async function renderBlogPosts(filteredPosts) {
      const postsToRender = filteredPosts || state.blogPosts; // Use filtered posts if available, otherwise all blog posts
  
      const blogPostsContainer = document.getElementById('posts-container');
      blogPostsContainer.innerHTML = '';
  
      await postsToRender.forEach(blogPost => {
        const blogPostElement = document.createElement('div');
        blogPostElement.classList.add('blog-post');
        blogPostElement.innerHTML = `
            <h2>${blogPost.title}</h2>
            <p>${blogPost.author.name}</p>
            <p>${blogPost.created_at}</p>
        `;
        blogPostsContainer.appendChild(blogPostElement);

        blogPostElement.addEventListener('click', () => {
            handlePostClick(blogPost);
          });
      });
    }
  
    function renderTags() {
      const blogTagsContainer = document.getElementById('tags-container');
      blogTagsContainer.innerHTML = '';
      const tags = state.blogPosts.map(blogPost => blogPost.tag);
      const uniqueTags = [...new Set(tags)];
      uniqueTags.unshift('All');
  
      uniqueTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.innerHTML = `
            <p>${tag}</p>
        `;
        blogTagsContainer.appendChild(tagElement);
  
        tagElement.addEventListener('click', () => {
          handleTagClick(tag);
        });
      });
    }

    function handleTagClick(tag) {
      if (tag === 'All') {
        renderBlogPosts(); // Render all blog posts
      } else {
        const filteredBlogPosts = state.blogPosts.filter(blogPost => blogPost.tag === tag);
        renderBlogPosts(filteredBlogPosts); // Render filtered blog posts
      }
    }

    function handlePostClick(post) {
        location.hash = `#blog-post/${post.slug}`;
        state.blogPost = post;
    }
  
    function renderPage() {
        loadBlogPosts().then(() => {
            renderBlogPosts().then(() => {
                renderTags()})
        });
        }

    renderPage();
  
}

export function initializeBlogPostPage() {

    function handlePostClick(post) {
        location.hash = `#blog-post/${post.slug}`;
        state.blogPost = post;
    }
    
    console.log('Blog page initialized');
    const titleDiv = document.getElementById("title-block");
    const contentDiv = document.getElementById("content-block");
    const sidebarContainer = document.getElementById('sidebar-next-blogs');
    titleDiv.innerHTML = `
        <p>${state.blogPost.title}</p>
        <p>${state.blogPost.tag}</p>
        <p>${state.blogPost.created_at}</p>
    `;
    contentDiv.innerHTML = state.blogPost.content;

    sidebarContainer.innerHTML = '';
        const nextBlogs = state.blogPosts.filter(blogPost => blogPost.title !== state.blogPost.title);
        console.log(nextBlogs)
        nextBlogs.forEach(blogPost => {
            const blogPostElement = document.createElement('div');
            blogPostElement.classList.add('blog-post');
            blogPostElement.innerHTML = `
                <h2>${blogPost.title}</h2>
                <p>${blogPost.created_at}</p>
            `;
            sidebarContainer.appendChild(blogPostElement);
    
            blogPostElement.addEventListener('click', () => {
                handlePostClick(blogPost);
              });
          });
}