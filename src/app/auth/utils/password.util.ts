import * as bcrypt from 'bcrypt';

export async function hashPasswordAsync(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}

export async function comparePasswordsAsync(enteredPassword: string, passwordHash: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, passwordHash);
}
