import { S3 } from "aws-sdk";
import { S3_CONFIG } from "@config/s3_config";
import { ManagedUpload } from "aws-sdk/lib/s3/managed_upload";

const { REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME_PREFIX } = S3_CONFIG;

const s3Client = new S3({
    region: REGION,
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
});

function getNameOfBucket() {
  switch((process.env.NODE_ENV || "dev")){
    case "dev":
      return "new-dev-assets"
    case "production":
      return "new-prod-assets"
  }
}

export async function s3upload(file, key: string, bucketName: string, mimeType: string): Promise<ManagedUpload.SendData> {
  const params = {
    Bucket: getNameOfBucket(),
    Key: key,
    Body: file,
    ContentType: mimeType, 
    // ACL: 'public-read'
  };
  let fileResp;
  try {
    fileResp = await s3Client.upload(params).promise();
    return fileResp;
  } catch (err) {
    console.log("s3 upload error ", err)
    return null;
  }
}