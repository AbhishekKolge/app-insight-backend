const fs = require('fs');
const csv = require('csv-parser');

const prisma = require('../prisma/prisma-client');

const filePath = 'data/app.csv';

const categoryCache = {};

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', async (row) => {
    try {
      const categoryName = row.Category.trim();
      if (categoryName) {
        let category = categoryCache[categoryName];

        if (!category) {
          category = await prisma.category.findUnique({
            where: { name: categoryName },
          });

          if (!category) {
            category = await prisma.category.create({
              data: { name: categoryName },
            });
            categoryCache[categoryName] = categoryName;
          } else {
            categoryCache[categoryName] = categoryName;
          }
        }
      }
    } catch (error) {}
  })
  .on('end', () => {
    console.log('Category seeding completed');
  });
