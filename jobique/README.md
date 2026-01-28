# Jobique 🚀

**Jobique** is an intelligent, AI-powered job application tracker designed to streamline your job search. Say goodbye to messy spreadsheets and hello to organized tracking, automated insights, and helpful reminders.

<img width="1696" height="824" alt="image" src="https://github.com/user-attachments/assets/00653c0d-37dc-4049-8ac8-6c26cab0032e" />
<img width="1485" height="852" alt="image" src="https://github.com/user-attachments/assets/3dcfb9fb-d7e7-4e40-b397-dd9634fa419f" />
<img width="1455" height="850" alt="image" src="https://github.com/user-attachments/assets/928b3219-a059-44f6-b7b6-76354ae7bf2f" />

## ✨ Key Features

- **📊 Smart Dashboard**: visual tracking of all your applications (Applied, Interviewing, Offered, etc.).
- **🤖 AI Auto-Fill**: Paste a job URL, and Jobique extracts the Role, Company, Location, and Description automatically.
- **✍️ AI Message Generator**: Draft personalized referral requests and cold messages in seconds.
- **📨 Automated Reminders**: Get email notifications for saved jobs you haven't applied to yet.
- **🤝 Job Sharing**: Share job opportunities with friends directly from the app.


## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
- **Styling**: Tailwind CSS, Framer Motion
- **AI & Utilities**: OpenAI API, Cheerio (Scraping), Nodemailer (Emails)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g., Vercel Postgres, Neon, Supabase)
- A Clerk account
- An OpenAI API key

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/jobique.git
    cd jobique
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```
    
    *(Optional) If you plan to use Python scripts:*
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set up Environment Variables**:
    Create a `.env` file in the root directory and add the following:

    ```env
    # Database
    DATABASE_URL="postgresql://..."

    # Authentication (Clerk)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...

    # AI Features
    OPENAI_API_KEY=ak-...

    # Email Service
    EMAIL_USER="your-email@gmail.com"
    EMAIL_PASS="your-app-password"

    # Job File Storage (AWS S3)
    AWS_ACCESS_KEY_ID=...
    AWS_SECRET_ACCESS_KEY=...
    AWS_REGION=us-east-1
    AWS_BUCKET_NAME=jobique-uploads


    # Cron Security
    CRON_SECRET="your-random-secret-string"
    ```

4.  **Initialize Database**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Add all the **Environment Variables** (from your `.env`) to the Vercel Project Settings.
4.  Deploy! 🚀

## 🛡️ Security

- **Authentication**: All sensitive routes are protected via Clerk Middleware.
- **Data Isolation**: Database queries are strictly scoped to the authenticated user's ID.
- **Cron Jobs**: Automated endpoints are secured with a secret key.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
