## Match Phrase

https://www.matchphrase.net is a game where you guess movie quotes from emojis as fast as possible. Kind of like Wordle meets Quick, Draw!

All of the puzzles, hints, and most of the code were generated using LLMs.

The prompt for coming up with movie quotes, emoji translations, and hints is at [media/prompt.txt](media/prompt.txt).

### Screenshots

<img src="media/instructions.jpg" width="400" />
<img src="media/gameplay.jpg" width="400" />

## Running locally

1. Install dependencies

```
npm install
```

2. Setup environment variables

Set `DATABASE_URL` and `DIRECT_DATABASE_URL` in `.env.local` with your PostgreSQL credentials.

```
DATABASE_URL="postgresql://username:password@localhost:6543/mydatabase?pgbouncer=true"
DIRECT_DATABASE_URL="postgresql://username:password@localhost:5432/mydatabase"
```

3. Initialize Database

Run the Prisma migrations to create the necessary tables in your database.

```
npx prisma migrate dev
```

4. Generate Prisma Client

If you haven't installed the Prisma CLI globally, you can generate the Prisma Client by running:

```
npx prisma generate
```

5. Run the Development Server

```
npm run dev
```

Open http://localhost:3000 in your browser to see the application.
