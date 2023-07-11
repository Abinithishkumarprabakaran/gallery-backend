import { client } from '../index.js';
import { ObjectId } from 'mongodb';

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

export async function getUserById(id) {
  return await client
      .db("GalleryVue")
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
}