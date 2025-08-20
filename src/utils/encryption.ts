import bcrypt from "bcryptjs";

//scrambling password using bcrypt for security
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
//comparing password that will bw entered by user with the hashed password
export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
git commit -m "hiding the password with bcrypt" 