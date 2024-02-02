# Book Store Backend

## Logic for Computing `sellCount`

The `sellCount` for each book is updated when a user purchases a book. The logic is as follows:

- **Incremental Update:** Upon a successful purchase, the `sellCount` of the corresponding book is increased by the quantity of books purchased.

## Mechanism for Sending Email Notifications

Email notifications are sent to authors using Gmail credentials. The process is outlined below:

- **Email Service:** The application employs the `nodemailer` library to establish an email service. Gmail credentials, including the sender's email and password, are securely configured.

- **Purchase Event Trigger:** When a user makes a purchase, the application identifies the authors associated with the purchased book by retrieving author information from the `Books` collection.

- **Email Content:** An email notification is composed with relevant purchase information, including book details, quantity purchased, and total price.

- **Asynchronous Sending:** Email notifications are sent asynchronously to prevent blocking the main application flow during the email sending process.

## Database Design and Implementation Choices

### User and Book Management

- **Users:** User information, along with roles (authors, admin, retail users), is securely stored in a `Users` collection. Passwords are hashed using `bcrypt` for enhanced security.

- **Books:** Book details, including the `sellCount`, are stored in a `Books` collection. The `sellCount` is dynamically updated in real-time upon successful book purchases.
