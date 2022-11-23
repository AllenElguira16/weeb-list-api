import path from 'path';
import fs from 'fs/promises';

export const getIDs = async (test = true) => {
  if (test) return ['1735'];

  console.log('start fetching: offline data');
  const offlineDataPath = path.resolve(__dirname, '../data/offline-db.json');
  const { data: offlineData } = JSON.parse(
    await fs.readFile(offlineDataPath, 'utf-8'),
  ) as OfflineDatabase;

  console.log('done fetch: offline data');

  console.log('start fetching: dead entries');

  const deadEntriesPath = path.resolve(__dirname, '../data/dead-entries.json');
  const { deadEntries } = JSON.parse(
    await fs.readFile(deadEntriesPath, 'utf-8'),
  ) as { deadEntries: string[] };

  console.log('done fetch: dead entries');

  return offlineData
    .map((offline) => {
      const matchedOfflineData = offline.sources
        .map(
          (sources) =>
            sources.match(/https\:\/\/myanimelist.net\/anime\/(\d+)/)?.[1],
        )
        .filter((sources): sources is string => !!sources);

      if (matchedOfflineData) return matchedOfflineData;
    })
    .flat()
    .filter((e): e is string => !!e)
    .filter((id) => !deadEntries.includes(id))
    .filter((e): e is string => !!e);
};

type OfflineDatabase = {
  data: [
    {
      sources: string[];
      title: string;
      type: string;
      episodes: number;
      status: string;
      animeSeason: {
        season: string;
        year: number;
      };
      picture: string;
      thumbnail: string;
      synonyms: string[];
      relations: string[];
      tags: string[];
    },
  ];
};
