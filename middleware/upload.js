import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client,DeleteObjectCommand,PutObjectCommand  } from "@aws-sdk/client-s3";
import { getMimeType } from "../utils/user_helper.js"; // Import the function

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // useAccelerateEndpoint: true,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: (req, file, cb) => {
      console.log('file',file);
      
      const mimeType = getMimeType(file); 
      console.log('mimeType',mimeType);
      
      cb(null, mimeType);
    },
    
    key: (req, file, cb) => {
      let folder = "uploads/";
      const mimeType = getMimeType(file)
      if (mimeType.startsWith("image/")) {
        folder = "images/";
      } else if (mimeType.startsWith("video/")) {
        folder = "videos/";
      }
      let fileName = `${folder}${Date.now()}-${file.originalname}`;
      console.log(fileName,"fileName")
      cb(null, fileName);
    },
  }),
});

const getPublicUrl = (fileKey) =>
  `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

const deleteFileFromS3 = async (fileUrl) => {
  if (!fileUrl) return;
  const fileKey = fileUrl.split(".amazonaws.com/")[1];
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  };
  try {
    await s3.send(new DeleteObjectCommand(params));
    console.log(`🗑️ Deleted from S3: ${fileKey}`);
  } catch (error) {
    console.error("❌ Error deleting file from S3:", error);
  }
};

const uploadPdfToS3 = async (fileBuffer, key, contentType) => {
  try {
      const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: fileBuffer,
          ContentType: contentType,
          Metadata: {
              'uploaded-by': 'trophy-talk-system',
              'document-type': 'ownership-certificate'
          }
      };

      // Use PutObjectCommand for AWS SDK v3
      const command = new PutObjectCommand(uploadParams);
      const result = await s3.send(command);
      
      // Construct the URL manually since PutObjectCommand doesn't return Location
      const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      
      console.log('✅ PDF uploaded to S3:', fileUrl);
      return {
          Location: fileUrl,
          Key: key,
          ...result
      };
  } catch (error) {
      console.error('❌ S3 upload error:', error);
      throw error;
  }
};


export { upload, getPublicUrl, deleteFileFromS3,uploadPdfToS3 };
