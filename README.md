
URL Shortening Service Documentation
=====================================

Step 1: Open Browser and Start the Process
-------------------------------------------
1. Open your browser.
2. Paste the following URL into the address bar:
   https://url-shorting-4qv2.onrender.com/auth/google
3. This URL navigates to an authentication page where you can log in using Google.

Step 2: Submit a URL for Shortening
-----------------------------------
1. Once authenticated, you will see an HTML page with fields to create a short URL.
2. Fill in the following fields:
   - Long URL: Paste the long URL you want to shorten.
   - Custom Alias: Type the name or alias you want to use for the shortened URL.
   - Topic: Enter a related topic for the URL.

3. Click the Submit button.

4. Upon submission, the system will return a response like the following:
   {
     "short_url": "example",
     "created_at": "2025-01-08T15:11:46.335Z"
   }
   - short_url contains your custom alias for the URL.
   - created_at specifies the date and time when the URL was created.

Step 3: Access the Shortened URL
--------------------------------
1. To test your shortened URL, use the following format:
   https://url-shorting-4qv2.onrender.com/api/shorten/<short_url>
   Replace <short_url> with the short_url value returned in the previous step. For example:
   https://url-shorting-4qv2.onrender.com/api/shorten/example

2. Paste this URL into your browser.
3. It will redirect you to the original long URL you provided.

Step 4: Access Swagger API Documentation
----------------------------------------
1. To view the API documentation, visit the Swagger UI by navigating to:
   https://url-shorting-4qv2.onrender.com/api-docs/
2. This provides detailed information about the API endpoints, parameters, and expected responses.
