import bcrypt from "bcryptjs";

const password = "password"; // <-- put the password you want to use
const saltRounds = 12;

const run = async () => {
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Password:", password);
  console.log("Hash:", hash);
};

run();
