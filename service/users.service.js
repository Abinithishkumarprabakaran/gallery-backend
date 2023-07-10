import { client } from '../index.js';

export async function getUserByEmail(email) {
  return await client
      .db("GalleryVue")
      .collection("users")
      .findOne({ email: email});
}

export async function createUser(data) {
  return await client
      .db("GalleryVue")
      .collection("users")
      .insertOne(data);
}