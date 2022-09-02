import { Anime, Character, Person, PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';
import { resolveImage } from './resolveImage';

const limit = 5000;
const prisma = new PrismaClient();

let timeSpent: number[] = [0];

function isBase64(text: string) {
  const base64regex =
    /^(data:image\/[a-z]+;base64,)([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return base64regex.test(text);
}

const round = (n: number) => (Math.round(n * 100) / 100).toFixed(2);

export const populateImages = async () => {
  await populateAnimeImages();

  timeSpent = [0];

  await populateCharacterImages();

  timeSpent = [0];

  await populatePersonImages();
};

const populateAnimeImages = async (currentIndex = 0, cursor?: string) => {
  try {
    const animeCount = await prisma.anime.count();
    let animelist: Anime[];

    if (!cursor) animelist = await prisma.anime.findMany({ take: limit });
    else
      animelist = await prisma.anime.findMany({
        cursor: {
          id: cursor,
        },
        take: limit,
      });

    for (const anime of animelist) {
      currentIndex++;
      console.clear();
      const averageTime = timeSpent.length
        ? timeSpent.reduce((acc, c) => acc + c, 0) / timeSpent.length
        : 0;
      const estimatedTime = round(
        (averageTime / 1000) * (animeCount - currentIndex),
      );
      const progress = round((currentIndex / animeCount) * 100);
      const dateString = DateTime.now()
        .plus({ seconds: parseFloat(estimatedTime) })
        .toFormat('dd/MM/yy hh:mm a');

      console.log(
        `(${new Date().toLocaleTimeString()}) Estimated Time: ${estimatedTime}s (${dateString})`,
      );
      console.log(
        `(${new Date().toLocaleTimeString()}) Progress: ${currentIndex}/${animeCount} (${progress}%)`,
      );
      console.log(
        `(${new Date().toLocaleTimeString()}) Current: ${anime.title} (${
          anime.id
        })`,
      );

      if (!isBase64(anime.picture)) {
        console.log(`fetching: ${anime.picture}`);
        await prisma.anime.update({
          where: {
            id: anime.id,
          },
          data: {
            picture: await resolveImage(anime.picture),
          },
        });
      }
      if (currentIndex === animeCount) break;
    }

    if (currentIndex === animeCount) return;
    else
      await populateAnimeImages(
        currentIndex,
        animelist[animelist.length - 1].id,
      );
  } catch (error) {
    console.error(error);
    console.log('an error occured, retrying...');
    await populateAnimeImages();
  }
};

const populateCharacterImages = async (currentIndex = 0, cursor?: string) => {
  try {
    const characterCount = await prisma.character.count();
    let characters: Character[];

    if (!cursor) characters = await prisma.character.findMany({ take: limit });
    else
      characters = await prisma.character.findMany({
        cursor: {
          id: cursor,
        },
        take: limit,
      });

    for (const character of characters) {
      if (currentIndex === characterCount) break;
      currentIndex++;
      const T1 = performance.now();
      console.clear();

      const averageTime = timeSpent.length
        ? timeSpent.reduce((acc, c) => acc + c, 0) / timeSpent.length
        : 0;
      const estimatedTime = round(
        (averageTime / 1000) * (characterCount - currentIndex),
      );
      const progress = round((currentIndex / characterCount) * 100);
      const dateString = DateTime.now()
        .plus({ seconds: parseFloat(estimatedTime) })
        .toFormat('dd/MM/yy hh:mm a');

      console.log(
        `(${new Date().toLocaleTimeString()}) Estimated Time: ${estimatedTime}s (${dateString})`,
      );
      console.log(
        `(${new Date().toLocaleTimeString()}) Progress: ${currentIndex}/${characterCount} (${progress}%)`,
      );
      console.log(
        `(${new Date().toLocaleTimeString()}) Current: ${
          character.englishName
        } (${character.id})`,
      );

      if (!isBase64(character.picture)) {
        await prisma.character.update({
          where: {
            id: character.id,
          },
          data: {
            picture: await resolveImage(character.picture),
          },
        });
      } else {
        continue;
      }

      const T2 = performance.now();
      timeSpent.push(T2 - T1);
    }

    if (currentIndex === characterCount) return;
    else
      await populateCharacterImages(
        currentIndex,
        characters[characters.length - 1].id,
      );
  } catch (error) {
    console.error(error.message);
    console.log('an error occured, retrying...');
    await populateCharacterImages();
  }
};

const populatePersonImages = async (currentIndex = 0, cursor?: string) => {
  try {
    const personCount = await prisma.person.count();
    let persons: Person[];

    if (!cursor) persons = await prisma.person.findMany({ take: limit });
    else
      persons = await prisma.person.findMany({
        cursor: {
          id: cursor,
        },
        take: limit,
      });

    for (const person of persons) {
      if (currentIndex === personCount) break;
      const T1 = performance.now();
      currentIndex++;
      console.clear();

      const averageTime = timeSpent.length
        ? timeSpent.reduce((acc, c) => acc + c, 0) / timeSpent.length
        : 0;
      const estimatedTime = round(
        (averageTime / 1000) * (personCount - currentIndex),
      );
      const progress = round((currentIndex / personCount) * 100);
      const dateString = DateTime.now()
        .plus({ seconds: parseFloat(estimatedTime) })
        .toFormat('dd/MM/yy hh:mm a');

      console.log(
        `(${new Date().toLocaleTimeString()}) Estimated Time: ${estimatedTime}s (${dateString})`,
      );
      console.log(
        `(${new Date().toLocaleTimeString()}) Progress: ${currentIndex}/${personCount} (${progress}%)`,
      );
      console.log(
        `(${new Date().toLocaleTimeString()}) Current: ${person.englishName} (${
          person.id
        })`,
      );

      if (!isBase64(person.picture)) {
        await prisma.person.update({
          where: {
            id: person.id,
          },
          data: {
            picture: await resolveImage(person.picture),
          },
        });
      } else {
        continue;
      }

      const T2 = performance.now();
      timeSpent.push(T2 - T1);
    }

    if (currentIndex === personCount) return;
    else
      await populatePersonImages(currentIndex, persons[persons.length - 1].id);
  } catch (error) {
    console.error(error);
    console.log('an error occured, retrying...');
    await populatePersonImages();
  }
};
