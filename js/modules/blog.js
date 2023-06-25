let state = {
    blogPosts: [],
    blogPost: {},
  };

export function initializeBlogPage() {
     
    async function loadBlogPosts() {
      await getBlogPosts()
        .then(data => {
          state.blogPosts = data;
          localStorage.setItem('blogPosts', JSON.stringify(state.blogPosts));
          return
        })
    }
  
    function getBlogPosts() {
      return fetch(apiUrl + 'blog_posts', {
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
      const postsToRender = filteredPosts || state.blogPosts;
      const blogPostsContainer = document.getElementById('posts-container');
      blogPostsContainer.innerHTML = '';
    
      for (const blogPost of postsToRender) {
        const blogPostElement = document.createElement('div');
        blogPostElement.classList.add('blog-post');
        blogPostElement.innerHTML = `
          <h2>${blogPost.title}</h2>
          <div class="tag-pills"></div>
          <p>${blogPost.summary.substring(0,200) + " ..."}</p>
        `;
    
        const tagPills = blogPostElement.querySelector('.tag-pills');
        for (const tag of blogPost.tags) {
          const tagElement = document.createElement('div');
          tagElement.classList.add('tag-pill');
          tagElement.innerHTML = `<p>${tag}</p>`;
          tagPills.appendChild(tagElement);
        }
    
        blogPostsContainer.appendChild(blogPostElement);
    
        blogPostElement.addEventListener('click', () => {
          handlePostClick(blogPost);
        });
      }
    }
    
  
    function renderTags() {
      const blogTagsContainer = document.getElementById('tags-container');
      blogTagsContainer.innerHTML = '';
      const uniqueTags = [...new Set(state.blogPosts.flatMap(blogPost => blogPost.tags))]
      uniqueTags.unshift('All');
  
      uniqueTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.innerHTML = `
            <p>${tag}</p>
        `;
        if (tag === 'All') {
          tagElement.classList.add('active');
        }
        blogTagsContainer.appendChild(tagElement);
  
        tagElement.addEventListener('click', () => {
          // Remove the 'active' class from all tags
          const allTags = document.querySelectorAll('.tag');
          allTags.forEach(t => t.classList.remove('active'));

          // Add the 'active' class to the clicked tag
          tagElement.classList.add('active');
          handleTagClick(tag);
        });
      });
    }

    function handleTagClick(tag) {
      if (tag === 'All') {
        renderBlogPosts(); // Render all blog posts
      } else {
        const filteredBlogPosts = state.blogPosts.filter(blogPost => blogPost.tags.includes(tag));
        renderBlogPosts(filteredBlogPosts); // Render filtered blog posts
      }
    }

    function handlePostClick(post) {
        location.hash = `#blog-post/${post.slug}`;
        state.blogPost = post;
        localStorage.setItem('blogPost', JSON.stringify(post));
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
        state.blogPost = post;
        localStorage.setItem('blogPost', JSON.stringify(post));
        location.hash = `#blog-post/${post.slug}`;
    }
    const storedBlogPost = localStorage.getItem('blogPost'); // Check if a blogPost is stored in localStorage
    if (storedBlogPost) {
      state.blogPost = JSON.parse(storedBlogPost); // Retrieve the stored blogPost
    }

    const storedBlogPosts = localStorage.getItem('blogPosts'); // Check if a blogPost is stored in localStorage
    if (storedBlogPosts) {
      state.blogPosts = JSON.parse(storedBlogPosts); // Retrieve the stored blogPost
    }

    const titleDiv = document.getElementById("title-block");
    const contentDiv = document.getElementById("content-block");
    const sidebarContainer = document.getElementById('sidebar-next-blogs');
    titleDiv.innerHTML = `
        <h1>${state.blogPost.title}</h1>
        <div class="blogpost-tags"></div>
        <p>${state.blogPost.created_at}</p>
    `;
    const tagDiv = document.querySelector('.blogpost-tags');
    state.blogPost.tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag-pill');
        tagElement.innerHTML = `
            <p>${tag}</p>
        `;
        tagDiv.appendChild(tagElement);
    });
    function unescapeHtml(html) {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = html;
      return textarea.value;
    }
    contentDiv.innerHTML = unescapeHtml(state.blogPost.content);

    sidebarContainer.innerHTML = '';
        const nextBlogs = state.blogPosts.filter(blogPost => blogPost.title !== state.blogPost.title);
        const fiveBlogs = nextBlogs.slice(0, 5);

        fiveBlogs.forEach(blogPost => {
            const blogPostElement = document.createElement('div');
            blogPostElement.classList.add('next-blog-post');
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