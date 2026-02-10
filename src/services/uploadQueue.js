import axios from "axios";
import { createFileChunks } from "../utils/chunkUploader";

const MAX_RETRIES = 3;

// 🔥 DYNAMIC BASE URL (LOCAL vs PROD)
const getBaseUrl = () => {
  const local = import.meta.env.VITE_API_BASE_URL_LOCAL;
  const prod = import.meta.env.VITE_API_BASE_URL;

  if (window.location.hostname === "localhost") {
    return local;
  }
  return prod;
};

const BASE_URL = getBaseUrl();

class UploadQueue {
  constructor() {
    this.queue = [];
    this.active = false;
  }

  add(file, onProgress, onSuccess, onError) {
    const fileId = crypto.randomUUID();
    const chunks = createFileChunks(file);

    this.queue.push({
      file,
      fileId,
      chunks,
      totalChunks: chunks.length,
      onProgress,
      onSuccess,
      onError,
    });

    this.process();
  }

  async process() {
    if (this.active || this.queue.length === 0) return;

    this.active = true;
    const task = this.queue.shift();

    try {
      for (let i = 0; i < task.chunks.length; i++) {
        const formData = new FormData();
        formData.append("fileId", task.fileId);
        formData.append("originalName", task.file.name);
        formData.append(
          "fileType",
          task.file.type.startsWith("video/") ? "video" : "image"
        );
        formData.append("chunkIndex", i);
        formData.append("totalChunks", task.totalChunks);
        formData.append("chunk", task.chunks[i]);

        let res;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            res = await axios.post(
              `${BASE_URL}/uploads/chunk`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                onUploadProgress: () => {
                  const percent = Math.round(
                    ((i + 1) / task.totalChunks) * 100
                  );
                  task.onProgress?.(percent);
                },
              }
            );
            break;
          } catch (err) {
            if (attempt === MAX_RETRIES) throw err;
            await new Promise((r) => setTimeout(r, 2000));
          }
        }

        // ✅ CORRECT HANDLING: 
        // - Ignore intermediate chunk responses
        // - Only call success when final URL arrives

        if (res?.data?.url) {
          // ✅ FINAL CHUNK — real success
          task.onSuccess?.(res.data.url);
        } else {
          // 🟡 INTERMEDIATE CHUNK — NOT AN ERROR
          console.log(
            `🟡 Chunk ${i + 1}/${task.totalChunks} accepted, waiting for final merge...`
          );
        }
      }
    } catch (err) {
      // ❌ ONLY REAL NETWORK / SERVER FAILURE COMES HERE
      task.onError?.(err);
    } finally {
      this.active = false;
      this.process();
    }
  }
}

export const uploadQueue = new UploadQueue();
