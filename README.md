# Anonymous Feedback Platform

A project that allows creators to generate a unique link where users can give feedback or ask questions anonymously. It also integrates with the Gemini API to suggest feedback messages to users, which they can send directly to the creator. Creators can control when they want to receive feedback and also have the option to delete feedback.

## Features

- **Anonymous Feedback**: Users can provide feedback or ask questions anonymously via a generated link.
- **Suggested Messages**: Integration with the Gemini API provides suggested messages to users on the feedback page.
- **Creator Controls**:
  - Toggle feedback reception on/off.
  - Option to delete feedback.

## Tech Stack

- **Frontend**:
  - **TypeScript**: A strongly typed programming language.
  - **Next.js**: A React framework for building applications.
  - **NextAuth**: Authentication for Next.js applications.
  - **React Hook Form**: Form management for React apps.
  - **Zod**: TypeScript-first schema validation.
  - **TailwindCSS**: A utility-first CSS framework for styling.

- **Backend**:
  - **MongoDB**: A NoSQL database to store feedback and user data.
  - **Mongoose**: ODM for MongoDB, providing schema and model management.
  - **Axios**: A promise-based HTTP client to handle API requests.
  - **bcryptjs**: Library to securely hash passwords.

- **UI & Design**:
  - **shadcn/ui**: Component library for building user interfaces in React.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/anonymous-feedback-platform.git
   cd anonymous-feedback-platform
    ```

2. **Install dependencies:**:
   ```bash
   npm install
    ```

3. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/anonymous-feedback-platform.git
    ```

4.  **Create an `.env` file in the root directory or use the `.env.sample` with your credentials** [.env.sample](https://github.com/kabhinayak02/anonymous-feedback/blob/main/.env.sample)

5. **Run the development server:**
    ```bash
    npm run dev
    ```

## Usage

### For Creators
- Create a feedback link.
- Share the link with users.
- Toggle feedback reception using the on/off button.
View, manage, or delete feedback.

### For Users
- Access the creator’s feedback link.
- Provide anonymous feedback or ask questions.
- View suggested messages (powered by Gemini API) and send them to the creator.
### Security
- Authentication: Secured with NextAuth.
- Data Protection: User feedback and sensitive data are securely stored in MongoDB, with passwords hashed using bcryptjs.