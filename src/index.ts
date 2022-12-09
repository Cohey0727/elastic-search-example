import { Client } from "@opensearch-project/opensearch";

const host = "localhost";
const protocol = "https";
const port = 9200;
const auth = "admin:admin";

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
  const id = "1";
  const document = {
    title: "The Outsider",
    author: "Stephen King",
    year: "2018",
    genre: "Crime fiction",
  };

  const response = await client.index({
    id,
    index: indexName,
    body: document,
    refresh: true,
  });

  console.log(response.body);
};

const searchDocument = async (indexName: string) => {
  console.log("Search results:");

  var query = {
    query: {
      match: {
        title: {
          query: "The Outsider",
        },
      },
    },
  };

  var response = await client.search({
    index: indexName,
    body: query,
  });

  console.log(response.body);
};

const main = async () => {
  const indexName = "books";
  await createIndex(indexName);
  await addDocument(indexName);
  await searchDocument(indexName);
};

main().catch(console.error);
