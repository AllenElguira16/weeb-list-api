import { PrismaClient } from '@prisma/client';
import MalWebScraper, { MALResponseError } from 'mal-web-scraper';
import getUuidByString from 'uuid-by-string';
import {
  saveAnime,
  saveCharacters,
  saveTitle,
  saveStaff,
  getIDs,
  addSource,
} from './helpers';
import fs from 'fs';
import path from 'path';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();

const timeSpent: number[] = [];

const acceptableTypes = ['Movie', 'ONA', 'OVA', 'Special', 'TV'];

const round = (n: number) => (Math.round(n * 100) / 100).toFixed(2);

export const main = async () => {
  try {
    await MalWebScraper.init();
    const malAnimeIDs = await getIDs();
    const configPath = path.resolve(__dirname, './data/config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as {
      current_index: number;
    };

    console.log(
      `(${new Date().toLocaleTimeString()}) done fetch: myanimelist IDs`,
    );

    for (
      let index = config.current_index;
      index < malAnimeIDs.length;
      index++
    ) {
      config.current_index = index;

      const malAnimeID = malAnimeIDs[index];

      const T1 = performance.now();

      const averageTimePerAnime = timeSpent.reduce(
        (a, e, i) => (a * i + e) / (i + 1),
        0,
      );
      const estimatedTime = round(
        (averageTimePerAnime / 1000) *
          (malAnimeIDs.length - config.current_index),
      );
      const progress = round((index / malAnimeIDs.length) * 100);
      const dateString = DateTime.now()
        .plus({ seconds: parseFloat(estimatedTime) })
        .toFormat('dd/MM/yy hh:mm a');

      console.log(
        `(${new Date().toLocaleTimeString()}) Estimated Time: ${estimatedTime}s (${dateString})`,
      );
      console.log(
        `(${new Date().toLocaleTimeString()}) Progress: ${index}/${
          malAnimeIDs.length
        } (${progress}%)`,
      );
      console.log(
        `(${new Date().toLocaleTimeString()}) Fetching Anime: ${malAnimeID}`,
      );

      const { data: anime } = await MalWebScraper.anime(
        parseInt(malAnimeID, 10),
      );

      if (
        anime.info.type !== null &&
        !acceptableTypes.includes(anime.info.type)
      ) {
        console.log('skipping');
        continue;
      }

      const animeID = getUuidByString(malAnimeID);

      await saveAnime(animeID, anime);

      await saveTitle(animeID, anime.info.alternative_titles);

      await saveCharacters(animeID, anime.characters);

      await saveStaff(animeID, anime.staffs);

      const T2 = performance.now();
      timeSpent.push(T2 - T1);

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }

    await MalWebScraper.close();
  } catch (error) {
    if (error instanceof MALResponseError && error.code === 404) {
      const deadEntriesPath = path.resolve(
        __dirname,
        './data/dead-entries.json',
      );
      const { deadEntries } = JSON.parse(
        fs.readFileSync(deadEntriesPath, 'utf-8'),
      ) as { deadEntries: string[] };

      deadEntries.push(error.id.toString());

      console.log('Not in Anime, saving to ' + deadEntriesPath);
      fs.writeFileSync(
        deadEntriesPath,
        JSON.stringify(
          {
            deadEntries,
          },
          null,
          2,
        ),
      );
    }
    console.error(error);
    console.log(`an error occured, restarting...`);
    await main();
  }
};

(async () => {
  await prisma.$connect();

  await main();

  await addSource();

  await prisma.$disconnect();
})();

process.on('SIGINT', async function () {
  await MalWebScraper.close();
  process.exit();
});
