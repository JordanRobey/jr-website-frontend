export function initializeAdminPage() {
    checkLoginStatus()
        .then(loggedIn => {
            if (loggedIn) {
                renderAdminLoggedIn();
            } else {
                renderAdminLogin();
            }
        })
        .catch(error => {
            console.error(error);
            renderAdminLogin();
        });
}

function checkLoginStatus() {
    return fetch(apiUrl + 'admin/check_login', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => data.logged_in)
        .catch(error => {
            console.error('Error checking login status:', error);
            throw error;
        });
}

function renderAdminLoggedIn() {
    document.getElementById('admin-container').innerHTML = `
        <div class="admin-logged-in">
            <h2>Admin Dashboard</h2>
            <button id="create-post-button" style="background-color: green; color: white">Create Post</button>
            <button id="edit-post-button" style="background-color: blue; color: white">Edit Post</button>
            <button id="delete-post-button" style="background-color: red; color: white">Delete Posts</button>
            <button id="logout-button">Logout</button>
        </div>
    `;

    const logoutButton = document.getElementById('logout-button');
    const createPostButton = document.getElementById('create-post-button');
    const editPostButton = document.getElementById('edit-post-button');
    const deletePostButton = document.getElementById('delete-post-button');
    logoutButton.addEventListener('click', () => {
        logout();
    });
    createPostButton.addEventListener('click', () => {
        renderCreatePostForm();
    }
    );
    editPostButton.addEventListener('click', () => {
        renderUpdatePostForm();
    }
    );
    deletePostButton.addEventListener('click', () => {
        renderDeletePostForm();
    }
    );
}

function renderAdminLogin() {
    document.getElementById('admin-container').innerHTML = `
        <div class="admin-login">
            <h2>Admin Login</h2>
            <form id="admin-login-form">
                <label for="email">Email</label>
                <input type="text" id="email" name="email" required>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
                <button type="submit">Login</button>
            </form>
        </div>
    `;

    const form = document.getElementById('admin-login-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        login(data)
            .then(() => {
                initializeAdminPage();
            })
            .catch(error => {
                console.error('Login error:', error);
                alert('Login failed.');
            });
    });
}

function renderDeletePostForm() {
        fetch(apiUrl + 'blog_posts', {
        method: 'GET',
      })
        .then(response => {
          return response.json();
        })
        .then((data) => {
            const adminContainer = document.getElementById('admin-container')
            adminContainer.innerHTML = ''
            const blogPosts = [...data]

            for (let i = 0; i < blogPosts.length; i++) {
                let post = document.createElement("div")
                post.innerHTML = `
                    <div>
                        <p>${blogPosts[i].title}</p>
                    </div>
                `
                adminContainer.appendChild(post)
            }
        

        })
        .catch(error => {
          console.error('Error fetching blog posts:', error);
        })

}

function renderCreatePostForm() {
    document.getElementById('admin-container').innerHTML = `
        <div class="create-post">
            <h2>Create Post</h2>
            <form id="create-post-form">
                <label for="title">Title</label>
                <input type="text" id="title" name="title" required>
                <label for="author">Author</label>
                <input type="text" id="author" name="author" required>
                <label for="tags">Tags</label>
                <textarea id="tags" name="tags" required></textarea>
                <label for="summary">Summary</label>
                <textarea id="summary" name="summary" required></textarea>
                <label for="content">Content</label>
                <textarea id="content" name="content" required rows="10" cols="50"></textarea>
                <button type="submit" id="create-post">Create Post</button>
            </form>
            <button id="back-to-admin">Back to Admin</button>
        </div>
    `;
    var previewWindow = null;

    function openPreviewWindow() {
        previewWindow = window.open("", "Markdown Preview", "width=800, height=600");
        previewWindow.document.write('<html><head><title>Markdown Preview</title></head><body><div id="preview"></div></body></html>');
        previewWindow.document.close();
    }

    function updatePreview() {
        // Update preview in the form
        var markdownInput = document.getElementById("content").value;
        var converter = new showdown.Converter();
        var html = converter.makeHtml(markdownInput);

        if (previewWindow.closed) {
            openPreviewWindow()
        }

        // Update preview in the separate window
        if (previewWindow && !previewWindow.closed) {
            previewWindow.document.getElementById("preview").innerHTML = html;
        }
    }
    openPreviewWindow();

    var contentTextarea = document.getElementById('content');
    contentTextarea.addEventListener('input', updatePreview);

    const backToAdmin = document.getElementById('back-to-admin');
    backToAdmin.addEventListener('click', () => {
        initializeAdminPage();
    });

    const form = document.getElementById('create-post-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.author = JSON.parse(data.author);
        data.tags = JSON.parse(data.tags);
        fetch(apiUrl + 'blog_posts/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(() => {
                initializeAdminPage();
            })
            .then(() => {
                alert('Post updated!');
            })
            .catch(error => {
                alert('Something went wrong. Please try again.');
            });
            
    });
    }

    function renderUpdatePostForm() {
        document.getElementById('admin-container').innerHTML = `
            <div class="create-post">
                <h2>Update Post</h2>
                <form id="update-post-form">
                    <label for="title">Title</label>
                    <input type="text" id="title" name="title" required>
                    <label for="author">Author</label>
                    <input type="text" id="author" name="author" required>
                    <label for="tags">Tags</label>
                    <textarea id="tags" name="tags" required></textarea>
                    <label for="summary">Summary</label>
                    <textarea id="summary" name="summary" required></textarea>
                    <label for="content">Content</label>
                    <textarea id="content" data-provide="markdown" name="content" required rows="10" cols="50"></textarea>
                    <button type="submit" id="update-post">Update Post</button>
                </form>
                <button id="back-to-admin">Back to Admin</button>
            </div>
        `;

        function htmltoMarkdown(html) {
            var turndownService = new TurndownService();
            turndownService.keep(['iframe']);
            var markdown = turndownService.turndown(html);
            return markdown
        }

        function markdowntoHtml(markdown) {
            var converter = new showdown.Converter();
            var html = converter.makeHtml(markdown);
            return html
        }

        var previewWindow = null;
    
        function openPreviewWindow() {
            previewWindow = window.open("", "Markdown Preview", "width=800, height=600");
            previewWindow.document.write('<html><head><title>Markdown Preview</title></head><body><div id="preview"></div></body></html>');
            previewWindow.document.close();
        }

            
        function updatePreview() {
            var markdownInput = document.getElementById("content").value;
            var html = markdowntoHtml(markdownInput);
        
            if (previewWindow.closed) {
                openPreviewWindow();
            }
        
            if (previewWindow && !previewWindow.closed) {
                previewWindow.document.getElementById("preview").innerHTML = html;
            }
        }
        

        let post_id = prompt("Enter post id to edit:")

        fetch(apiUrl + 'blog_posts/' + post_id, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
                }
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById("title").value = data.title;
                    document.getElementById("author").value = JSON.stringify(data.author)
                    document.getElementById("tags").value = JSON.stringify(data.tags);
                    document.getElementById("summary").value = data.summary;
                    document.getElementById("content").value = htmltoMarkdown(data.content);
                })
                .then(() => { 
                    openPreviewWindow()
                })
                .then(() => {
                    var contentTextarea = document.getElementById('content');
                    contentTextarea.addEventListener('input', updatePreview);
                })
                .then(() => {
                    updatePreview()
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    alert('Something went wrong. Please try again.');
                });
    
        const backToAdmin = document.getElementById('back-to-admin');
        backToAdmin.addEventListener('click', () => {
            initializeAdminPage();
        });
    
        const form = document.getElementById('update-post-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            data.content = markdowntoHtml(data.content);
            data.author = JSON.parse(data.author);
            data.tags = JSON.parse(data.tags);
            console.log(data)
            fetch(apiUrl + `blog_posts/update/${post_id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(() => {
                alert('Post updated!');
            })
                .then(() => {
                    initializeAdminPage();
                })
                .catch(error => {
                    alert('Something went wrong. Please try again.');
                });
                
        });
        }

    function login(data) {
        return fetch(apiUrl + 'admin/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(response => {
            console.log(response);
            if (response.status === 200) {
              return response.json();
            } else {
              throw new Error('Login failed');
            }
          })
          .then(data => {
            if (data.login_success === true) {
              alert('Logged in!');
            } else {
              throw new Error('Login failed');
            }
          })
          .catch(error => {
            console.error('Login error:', error);
            throw error;
          });
      }
      

function logout() {
    fetch(apiUrl + 'admin/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.status === 200) {
                alert('Logged out!');
                initializeAdminPage();
            } else {
                throw new Error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
            alert('Something went wrong. Please try again.');
        });
}
