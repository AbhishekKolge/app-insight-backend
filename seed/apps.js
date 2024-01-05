const fs = require('fs');
const csv = require('csv-parser');

const prisma = require('../prisma/prisma-client');

const filePath = 'data/app.csv';

const getKiloBytes = (size) => {
  const givenSize = size.toLowerCase();

  if (givenSize.includes('m')) {
    const number = givenSize.split('m')[0];
    return +number ? +number : null;
  } else if (givenSize.includes('k')) {
    const number = givenSize.split('k')[0];
    return +number ? +number / 1000 : null;
  }
  return null;
};

const getPrice = (price) => {
  const givenPrice = price.split('$')[1];
  return +givenPrice ? +givenPrice : 0;
};

const appCache = {};

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', async (row) => {
    try {
      const appName = row.App.trim();
      if (appName) {
        let app = appCache[appName];
        if (!app) {
          app = await prisma.app.findUnique({
            where: { name: appName },
          });
          if (!app) {
            const { id: categoryId } = await prisma.category.findUnique({
              where: { name: row.Category },
            });
            const { id: contentRatingId } =
              await prisma.contentRating.findUnique({
                where: { name: row['Content Rating'] },
              });
            const { id: genreId } = await prisma.genre.findUnique({
              where: { name: row.Genres },
            });
            const appDetails = {
              name: appName,
              rating: row.Rating ? (+row.Rating ? +row.Rating : null) : null,
              reviewCount: row.Reviews ? (+row.Reviews ? +row.Reviews : 0) : 0,
              size: row.Size ? getKiloBytes(row.Size) : null,
              installCount: parseInt(
                row.Installs.split('+')[0].replace(/,/g, ''),
                10
              ),
              type: row.Type.toLowerCase() === 'paid' ? 'PAID' : 'FREE',
              price: row.Price === '0' ? 0 : getPrice(row.Price),
              updatedAt: new Date(Date.parse(row['Last Updated'])),
              currentVersion: row['Current Ver'] || null,
              androidVersion: row['Android Ver'] || null,
              categoryId,
              contentRatingId,
              genreId,
            };
            app = await prisma.app.create({
              data: appDetails,
            });
            appCache[appName] = appName;
          } else {
            appCache[appName] = appName;
          }
        }
      }
    } catch (error) {}
  })
  .on('end', () => {
    console.log('Apps seeding completed');
  });
