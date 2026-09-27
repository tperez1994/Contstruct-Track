# Construct Track

Construct Track is a construction project management web application I created to make it easier to keep track of construction projects in one place. The application allows users to create an account, log in, and manage their own projects through a dashboard.

I developed the project using the AI-assisted development process covered in the FAU AI Hootcamp. AI tools were used throughout the project to help generate code, make changes, troubleshoot problems, and get the application deployed and working correctly.

## Live Application

https://super-otter-966d29.netlify.app

## GitHub Repository

https://github.com/tperez1994/Contstruct-Track

## What the Application Does

Construct Track gives a user a dashboard where they can manage their construction projects.

Users can:

- Register for an account
- Log in and log out
- Create new projects
- View their projects
- Edit existing projects
- Delete projects
- Filter projects by status
- Track contract values
- View basic project statistics from the dashboard

Each project can contain information such as the project name, client, location, contract value, status, start date, and notes.

## Technologies Used

- HTML
- CSS
- JavaScript
- Vite
- Supabase
- Supabase Authentication
- Supabase Database
- Git
- GitHub
- Netlify
- Visual Studio Code
- AI development tools

## AI-Assisted Development

The main purpose of this assignment was to practice building software using AI tools instead of writing everything manually.

I used AI assistance throughout the development of Construct Track. AI helped me build and modify the application, connect the frontend to Supabase, set up authentication, create the project database, troubleshoot errors, and deploy the finished application.

I still tested the application throughout development to make sure the generated code and changes actually worked.

This gave me experience using AI as part of the software development process instead of only using it to answer coding questions.

## Database and Authentication

I used Supabase for the database and user authentication.

The database stores the construction projects created by users. Supabase Authentication handles user registration, login, logout, and user sessions.

I also used Supabase Row Level Security so users can only access the project data associated with their account.

The application supports the four basic CRUD operations:

- Create
- Read
- Update
- Delete

## GitHub and Version Control

I used Git and GitHub for version control throughout the project.

Changes were committed and pushed to the public GitHub repository as I worked on the application. The GitHub repository is also connected to Netlify so the finished application can be deployed online.

## Deployment

Construct Track is deployed through Netlify.

Netlify builds the application from the GitHub repository and hosts the live version of the project.

The Supabase connection information is stored using environment variables rather than being placed directly into the source code.

## Running the Project Locally

To run the project locally:

1. Clone the repository:

   git clone https://github.com/tperez1994/Contstruct-Track.git

2. Open the project folder:

   cd Contstruct-Track

3. Install the required dependencies:

   npm install

4. Create a `.env` file in the main project folder.

5. Add the following environment variables:

   VITE_SUPABASE_URL=your_supabase_project_url

   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

6. Start the application:

   npm run dev

7. Open the local address provided by Vite.

## Testing

I tested the final deployed version of Construct Track to make sure the main features worked correctly.

I tested:

- User registration
- User login and logout
- Creating projects
- Viewing project information
- Editing projects
- Deleting projects
- Dashboard statistics
- Database persistence

The final testing was completed using the deployed Netlify version instead of only testing the application locally.

## Author

Tim Perez  
Florida Atlantic University  
Computer Science

## Demo Video

The following video demonstrates the deployed Construct Track application, including user authentication, project management, database functionality, and the overall project structure.

https://youtu.be/xGC55MezBLo