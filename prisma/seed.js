const PrismaClient = require("@prisma/client").PrismaClient;
const seedData = require(`media/matchquotes.json`);

async function main() {
  const prisma = new PrismaClient();
  for (const row of seedData) {
    // Strip out period and punctuation
    let phrase = await prisma.phrase.findFirst({
      where: {
        content: row.phrase,
      },
    });

    const emojis = row.emoji.map((it) => {
      return { emoji: it };
    });
    if (!phrase) {
      phrase = await prisma.phrase.create({
        data: {
          content: row.phrase,
          hints: row.hint.join("||"),
          emojis: {
            create: emojis,
          },
        },
      });
      console.log(phrase);
    } else {
      console.error(`Puzzle already exists for: `, row.phrase);
    }
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
