import fs from "fs";
import { Client } from "@opensearch-project/opensearch";
import path, { dirname } from "path";
import { parse } from "csv-parse/sync";

// ElasticSearch Configs
const host = "localhost";
const protocol = "https";
const port = 9200;
const auth = "admin:admin";

const projectRoot = path.resolve("./");

const client = new Client({
  node: `${protocol}://${auth}@${host}:${port}`,
  ssl: { rejectUnauthorized: false },
});

const createIndex = async (indexName: string) => {
  console.log("Creating index:");

  const settings = {
    settings: {
      index: {
        number_of_shards: 4,
        number_of_replicas: 3,
      },
    },
  };

  const response = await client.indices.create({
    index: indexName,
    body: settings,
  });
  console.log(response.body);
};

const addDocument = async (indexName: string) => {
  console.log("Adding document:");
  const source = path.join(projectRoot, "movies.csv");
  const buffer = fs.readFileSync(source);
  const rows: any[] = parse(buffer);

  const responses = rows.map((row) => {
    const document = {
      title: row[2],
      director: row[3],
      country: row[5],
      description: row[11],
    };
    return client.index({
      id: row[0],
      index: indexName,
      body: document,
      refresh: true,
    });
  });
  await Promise.all(responses);
};

// Sample
const searchDocument = async (indexName: string) => {
  console.log("Search results:");

  const query = {
    query: {
      match: {
        title: {
          query: "The Outsider",
        },
      },
    },
  };

  const response = await client.search({
    index: indexName,
    body: query,
  });

  console.log(response.body);
};

const main = async () => {
  const indexName = "movies";
  await createIndex(indexName);
  await addDocument(indexName);
};

main().catch(console.error);
