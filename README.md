# MadaniLab Finance

**MadaniLab.Finance** is a dashboard that helps you analyze your financial transactions. Track your income and expenses to gain better insights into your financial health.

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/bardiamdn/finance-app
```

### Build Image and Containerize

Navigate to the directory containing the Docker configuration and start the container:

```bash
cd finance-app/nginx/dist
docker-compose up -d  # Use --build --force-recreate to rebuild the image if necessary
```

### Run in Development Mode

To run the source code in development mode, set the mode to development in the .env file, then run:

```bash
cd finance-app/financeApp
npm run dev
```
