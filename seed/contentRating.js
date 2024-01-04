const fs = require('fs');
const csv = require('csv-parser');

const prisma = require('../prisma/prisma-client');

const filePath = 'data/app.csv';

const contentRatingCache = {};

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', async (row) => {
    try {
      const contentRatingName = row['Content Rating'].trim();
      if (contentRatingName) {
        let contentRating = contentRatingCache[contentRatingName];

        if (!contentRating) {
          contentRating = await prisma.contentRating.findUnique({
            where: { name: contentRatingName },
          });

          if (!contentRating) {
            contentRating = await prisma.contentRating.create({
              data: { name: contentRatingName },
            });
            contentRatingCache[contentRatingName] = contentRatingName;
          } else {
            contentRatingCache[contentRatingName] = contentRatingName;
          }
        }
      }
    } catch (error) {}
  })
  .on('end', () => {
    console.log('Content rating seeding completed');
  });
