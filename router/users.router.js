import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { getUserByEmail, createUser, getUserById } from "../service/users.service.js";

const router = express.Router();

async function generateHashedPassword(password) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

router.post("/signup", async function (request, response) {
  const { firstname, lastname, email, password } = request.body;

  console.log(request.body);

  const userFromDB = await getUserByEmail(email);

  // console.log("user From DB", userFromDB)

  if(userFromDB) {
    response.status(404).send({ message: "Already Exists" })
  }
  else if(password.length < 8) {
    response.status(404).send({ message: "Password Length should be more than 8 characters" })
  }
  else {
    const hashedPassword = await generateHashedPassword(password)
    const result = await createUser({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword
    })
    response.send(result)
  }
});

router.post("/login", async function (request, response) {

  const { email, password } = request.body;

  const userFromDB = await getUserByEmail(email);
  
  if(!userFromDB) {
    response.status(404).send({ message: "Invalid Credentials" });
  }
  else {
    const storedPassword = userFromDB.password;
    const isPasswordCheck = await bcrypt.compare(password, storedPassword);

    if( isPasswordCheck ) {
      const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY)
      response.send({ message: "Login Successfully", token: token, user: userFromDB });
    }
    else {
      response.status(401).send({ message: 'Invalid Credentials' })
    }
  }
})

router.get("/profile/id", async function(request, response) {

  console.log("Profile is Triggered")

  const { id } = request.params;

  console.log(request.params)

  const user = await getUserById(id);

  user ? response.send(user) : response.status(404).send({ message: "User Not Found" })
})

export default router;