export const S3_CONFIG = {
  REGION: "ap-south-1",
  ACCESS_KEY_ID: "",
  SECRET_ACCESS_KEY: "",
  BUCKET_NAME_PREFIX: (process.env.NODE_ENV || "dev") + "-",
};