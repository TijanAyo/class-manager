import {
  S3Client,
  PutObjectCommand,
  // GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { constants } from '../utils';
import { putCommandParams } from '../interface';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  credentials: {
    accessKeyId: constants.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: constants.AWS_BUCKET_SECRET_KEY,
  },
  region: constants.AWS_BUCKET_REGION,
});

export async function addItemToBucket(
  params: putCommandParams,
  folder: string,
) {
  try {
    const command = new PutObjectCommand({
      ...params,
      Key: `${folder}/${params.Key}`,
    });
    await s3.send(command);
    console.log('Item uploaded successfully');
  } catch (e) {
    console.error(`addItemToBucket Error`, e.message, e.stack);
    throw e;
  }
}

/* export async function generateImageURLFromRandomName(imageName: string) {
  try {
    const param = {
      Bucket: constants.AWS_BUCKET_NAME,
      Key: imageName,
    };
    const command = new GetObjectCommand(param);
    return await getSignedUrl(s3, command);
  } catch (e) {
    console.error(`generateImageURLFromRandomName Error`, e.message, e.stack);
    throw e;
  }
} */

export async function generateImageURLFromRandomName(imageName: string) {
  try {
    const publicUrl = `https://${constants.AWS_BUCKET_NAME}.s3.${constants.AWS_BUCKET_REGION}.amazonaws.com/photos/${imageName}`;
    return publicUrl;
  } catch (e) {
    console.error(`generateImageURLFromRandomName Error`, e.message, e.stack);
    throw e;
  }
}

export async function grabImageNameFromUrl(signedUrl: string) {
  const url = new URL(signedUrl);

  const urlPath = url.pathname;

  const urlSegment = urlPath.split('/');

  return urlSegment[urlSegment.length - 1];
}

export async function deleteItemFromBucket(itemName: string, folder: string) {
  try {
    const params = {
      Bucket: constants.AWS_BUCKET_NAME,
      Key: itemName,
    };
    const command = new DeleteObjectCommand({
      ...params,
      Key: `${folder}/${params.Key}`,
    });
    await s3.send(command);
    console.log('Item deleted successfully');
  } catch (e) {
    console.error(`deleteItemFromBucket Error`, e.message, e.stack);
    throw e;
  }
}
