const fs = require('fs');
const csv = require('csv-parser');

const prisma = require('../prisma/prisma-client');

const filePath = 'data/app.csv';

const genreCache = {};

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', async (row) => {
    try {
      const genreName = row.Genres.trim();
      if (genreName) {
        let genre = genreCache[genreName];

        if (!genre) {
          genre = await prisma.genre.findUnique({
            where: { name: genreName },
          });

          if (!genre) {
            genre = await prisma.genre.create({
              data: { name: genreName },
            });
            genreCache[genreName] = genreName;
          } else {
            genreCache[genreName] = genreName;
          }
        }
      }
    } catch (error) {}
  })
  .on('end', () => {
    console.log('Genre seeding completed');
  });
