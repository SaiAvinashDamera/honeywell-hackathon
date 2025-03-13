import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // Initialization vector length

// Deriving a key using SHA256 based on the first name
const generateKey = (firstName: string) => {
  return crypto
    .createHash('sha256')
    .update(firstName)
    .digest('base64')
    .substring(0, 32);
};

// Encrypt function using AES-256-CBC
const encrypt = (text: string, firstName: string) => {
  const key = generateKey(firstName);
  const iv = crypto.randomBytes(IV_LENGTH); // Generate random IV
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return IV concatenated with the encrypted data
  return iv.toString('hex') + ':' + encrypted;
};

// Decrypt function using AES-256-CBC
const decrypt = (encryptedText: string, firstName: string) => {
  const key = generateKey(firstName);
  const [ivHex, encrypted] = encryptedText.split(':'); // Split IV and encrypted text
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { inputString, firstName, type } = req.body;

  if (!inputString || !firstName || !type) {
    return res.status(400).json({
      error: 'Missing required fields: text, firstName, and mode are required.',
    });
  }

  try {
    let result;

    // Encryption or Decryption logic based on the mode
    if (type === 'Encryption') {
      result = encrypt(inputString, firstName);
    } else if (type === 'Decryption') {
      result = decrypt(inputString, firstName);
    } else {
      return res.status(400).json({
        error: "Invalid type. Allowed modes: 'Encryption' or 'Decryption'.",
      });
    }

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Encryption/Decryption error:', error); // Log the error details
    return res
      .status(500)
      .json({ error: 'Encryption/Decryption failed. Please try again later.' });
  }
}
