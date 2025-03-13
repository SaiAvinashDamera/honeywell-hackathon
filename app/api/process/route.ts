import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

const generateKey = (firstName: string) => {
  return crypto
    .createHash('sha256')
    .update(firstName)
    .digest('base64')
    .substring(0, 32);
};

const encrypt = (text: string, firstName: string) => {
  const key = generateKey(firstName);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Store IV with encrypted text
};

const decrypt = (encryptedText: string, firstName: string) => {
  const key = generateKey(firstName);
  const [ivHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export async function handler(request: NextRequest) {
  if (request.method === 'POST') {
    try {
      const formData = await request.formData();
      const inputString = await formData.get('inputString')?.toString();
      const type = await formData.get('type')?.toString();
      const firstName = await formData.get('firstName')?.toString();

      let result;
      if (type === 'Encryption') {
        //@ts-expect-error
        result = encrypt(inputString, firstName);
      } else if (type === 'Decryption') {
        //@ts-expect-error
        result = decrypt(inputString, firstName);
      } else {
        return new NextResponse(
          JSON.stringify({ message: 'Invalid operation type.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new NextResponse(JSON.stringify({ result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ message: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } else {
    return new NextResponse(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export { handler as GET, handler as POST };
