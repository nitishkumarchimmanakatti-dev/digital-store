import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Define a generic file route for digital products
  productFile: f({ 
    blob: { maxFileSize: "128MB" }, 
    image: { maxFileSize: "16MB" }, 
    pdf: { maxFileSize: "32MB" },
    text: { maxFileSize: "8MB" },
    video: { maxFileSize: "256MB" },
    audio: { maxFileSize: "32MB" }
  }).onUploadComplete(async ({ file }) => {
    return { fileUrl: file.url };
  }),
  
  // Define an image-only route for product covers
  coverImage: f({ 
    image: { maxFileSize: "4MB" } 
  }).onUploadComplete(async ({ file }) => {
    return { fileUrl: file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
