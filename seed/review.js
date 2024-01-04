const fs = require('fs');
const csv = require('csv-parser');

const prisma = require('../prisma/prisma-client');

const filePath = 'data/review.csv';

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', async (row) => {
    try {
      const reviewAppName = row.App.trim();

      if (reviewAppName) {
        const { id: appId } = await prisma.app.findUnique({
          where: { name: reviewAppName },
        });

        if (appId) {
          await prisma.review.create({
            data: {
              comment: row['Translated_Review'],
              appId,
              sentiment: row.Sentiment.toUpperCase() || null,
            },
          });
        }
      }
    } catch (error) {}
  })
  .on('end', () => {
    console.log('Review seeding completed');
  });
