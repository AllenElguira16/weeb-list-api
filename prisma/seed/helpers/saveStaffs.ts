import { PrismaClient } from '@prisma/client';
import type { Anime as MALAnime } from 'mal-web-scraper';
import MalWebScraper from 'mal-web-scraper';
import getUuidByString from 'uuid-by-string';
import { main } from '..';
import { resolveImage } from './resolveImage';

const prisma = new PrismaClient();

export const saveStaff = async (
  animeID: string,
  staffs: MALAnime['staffs'],
) => {
  try {
    for (const malStaff of staffs) {
      const personID = getUuidByString(malStaff.staff_id.toString());
      const personDB = await prisma.person.findFirst({
        where: { id: personID },
      });

      if (!personDB) {
        console.log(
          `(${new Date().toLocaleTimeString()}) Fetching Staff: ${
            malStaff.staff_id
          }`,
        );
        const { data: person } = await MalWebScraper.person(malStaff.staff_id);

        if (person.english_name === null) throw new Error('Empty Name');

        await prisma.person.create({
          data: {
            id: personID,
            englishName: person.english_name,
            kanjiName: person.kanji_name,
            picture: await resolveImage(person.picture),
            about: person.about,
          },
        });
      }

      for (const position of malStaff.role) {
        const staffsOnAnimeCount = await prisma.staff.count({
          where: {
            animeId: animeID,
            personId: personID,
          },
        });

        if (staffsOnAnimeCount === 0)
          await prisma.staff.create({
            data: {
              positions: [],
              animeId: animeID,
              personId: personID,
            },
          });

        const staffsOnAnime = await prisma.staff.findFirstOrThrow({
          where: {
            animeId: animeID,
            personId: personID,
          },
        });

        const updatedPositions = [
          ...new Set([...staffsOnAnime.positions, position]),
        ];

        await prisma.staff.update({
          where: {
            id: staffsOnAnime?.id,
          },
          data: {
            positions: {
              set: updatedPositions,
            },
          },
        });
      }
    }
  } catch (error) {
    console.error(error);
    console.log(`an error occured, restarting...`);
    await main();
  }
};
