import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';

// Configure S3 client connecting to MinIO
const s3Client = new S3Client({
  endpoint: 'http://192.168.1.2:9000', // S3 API endpoint
  region: 'us-east-1', // Required parameter, can be dummy for MinIO
  credentials: {
    accessKeyId: 'admin',
    secretAccessKey: 'passwd@123',
  },
  forcePathStyle: true, // Required for MinIO
});

const BUCKET_NAME = 'erp-system';

/**
 * Ensures that the bucket exists and has public read access policy
 */
async function ensureBucketWithPublicPolicy() {
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicRead',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
      },
    ],
  };

  try {
    // Check if the bucket exists
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
  } catch (err: any) {
    // If bucket doesn't exist, create it
    await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
  }

  try {
    // Apply public read policy to allow anonymous GET access
    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: BUCKET_NAME,
        Policy: JSON.stringify(policy),
      }),
    );
  } catch (policyErr) {
    console.error('Failed to set public bucket policy:', policyErr);
  }
}

/**
 * Uploads a file directly from the browser to MinIO bucket
 * @param file The file object from the input element
 * @param folderName Optional folder name prefix
 * @param prefix Optional prefix for the filename
 * @param postfix Optional postfix for the filename
 * @returns The absolute URL of the uploaded S3 object
 */
export async function uploadFileToMinio(
  file: File,
  folderName?: string,
  prefix?: string,
  postfix?: string,
): Promise<string> {
  // Ensure bucket exists and has correct read policy
  await ensureBucketWithPublicPolicy();

  const lastDot = file.name.lastIndexOf('.');
  const ext = lastDot !== -1 ? file.name.slice(lastDot) : '';
  const stem = lastDot !== -1 ? file.name.slice(0, lastDot) : file.name;

  const prefixStr = prefix ? `${prefix}_` : '';
  const postfixStr = postfix ? `_${postfix}` : '';
  const stemSafe = stem.replace(/\s+/g, '_');
  const filename = `${prefixStr}${Date.now()}_${stemSafe}${postfixStr}${ext}`;

  const fileKey = folderName ? `${folderName}/${filename}` : filename;

  const buffer = await file.arrayBuffer();

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: new Uint8Array(buffer),
      ContentType: file.type,
    }),
  );

  // Return the absolute public URL of the object in MinIO
  return `http://192.168.1.2:9000/${BUCKET_NAME}/${fileKey}`;
}
