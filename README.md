# Bicycle Management App

A simple web application for managing a fleet of bicycles, built with **Next.js**, **React**, **TypeScript**, and **Google Sheets** as the backend database.

## Features

- **List all bicycles** with clear status indicators ("Active" or "Inactive")
- **View details** of each bicycle
- **Activate a bicycle** by assigning it to a user
- **Deactivate a bicycle** (mark as returned)
- **User-friendly interface** with instant feedback and error handling
- **Server-Side Rendering (SSR)** for fast and SEO-friendly page loads
- **Data persistence** via Google Sheets API (no traditional database needed)
- **Action logs** for all status changes

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [CSS Modules](https://github.com/css-modules/css-modules)

## How It Works

- The main data source is a Google Spreadsheet (“Bike Database” and “Logs” sheets).
- Bicycles can be activated (assigned to a user) or deactivated (returned).
- All status changes are logged with timestamps.
- All API interactions (reading/updating bicycles, logging actions) are handled via custom Next.js API routes.
- The app uses SSR (getServerSideProps) to fetch bicycle data on each page load for best performance and reliability.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A Google Cloud project with Sheets API enabled
- Service Account credentials for Google Sheets API

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/bicycle-management-app.git
   cd bicycle-management-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env.local` file** with the following variables:

   ```
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   SHEETS_ID=your_google_sheets_id
   GOOGLE_CLIENT_EMAIL=your_service_account_email
   GOOGLE_PRIVATE_KEY="your_private_key" # Use double quotes and keep line breaks as \n
   ```

4. **Set up your Google Sheets:**
   - Sheet 1: `Bike Database` (with columns: ID, Status, Brand, User, starting from B3)
   - Sheet 2: `Logs` (with columns: Date, Status, ID, Brand, User)

5. **Share your Google Sheet** with the service account email.

6. **Run the development server:**
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Folder Structure

```
/pages
  /api          # API routes for bikes and logs
    /bike
      /[id].ts
    logs.ts
    index.ts
  /bike         # Dynamic bike details pages
    [id].tsx
  index.tsx     # Home page (bicycle list)
/styles         # CSS Modules for styling
   HomePage.module.css
   BikePage.module.css
   global.css
/utils          # Google Sheets utility functions, date formatting, etc.
   formateDate.ts
   googleSheet.ts
```

## Customization

- **Styling**: Uses CSS Modules for component-scoped styling. You can easily switch to Tailwind CSS or SCSS if preferred.
- **Extending**: The app is modular and easy to extend with new features (like user authentication, filtering, reporting, etc).


**Made with ❤️ using Next.js and Google Sheets**
