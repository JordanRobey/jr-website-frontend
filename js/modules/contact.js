export function initializeContactPage() {
    const form = document.getElementById('contact-form');
    const clearButton = document.getElementById('clear-button');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
        fetch('http://127.0.0.1:5000/messages/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.status == 200) {
                alert('Message sent successfully');
            } else {
                alert("Well, I didn't expect that - Message failed to send. Looking into it :)");
            }
            return response.json();
        }
        )
    });
    clearButton.addEventListener('click', function() {
      form.reset();
    });
  }