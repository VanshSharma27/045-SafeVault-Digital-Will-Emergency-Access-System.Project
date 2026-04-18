const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY = crypto
  .createHash('sha256')
  .update(process.env.SECRET_KEY || 'safevaultsecret123')
  .digest();

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encryptedData: encrypted, iv: iv.toString('hex') };
};

const decrypt = (encryptedData, ivHex) => {
  try {
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return '';
  }
};

module.exports = { encrypt, decrypt };
