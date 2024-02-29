function toggleMenu() {
    var menu = document.querySelector('.vertical-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

document.getElementById('emailLoginForm').addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission
            
            // AJAX request for email/password login
            var formData = new FormData(this);
            fetch('/auth/email', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(handleAuthResponse)
            .catch(handleAuthError);

            // Handle Google OAuth redirection separately
            document.querySelector('.google-login').addEventListener('click', function() {
                window.location.href = '/auth/google'; // Directly navigate for OAuth flow
            });
        });

        function handleAuthResponse(data) {
            if(data.success) {
                console.log('Login Successful', data.message);
                window.location.href = '/dashboard';
            } else {
                console.log('Login Failed', data.message);
                alert('Login Failed: ' + data.message);
            }
        }

        function handleAuthError(error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
 // Function to handle form submission
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission
            
            // AJAX request for registering a new user
            var formData = new FormData(this);
            fetch('{{ url_for("add_user") }}', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    console.log('Registration Successful', data.message);
                    // Redirect to dashboard or any other page after successful registration
                    window.location.href = '/dashboard';
                } else {
                    console.log('Registration Failed', data.message);
                    alert('Registration Failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
