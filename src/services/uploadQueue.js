import axios from "axios";
import { createFileChunks } from "../utils/chunkUploader";

const MAX_RETRIES = 3;

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
formData.append("originalName", task.file.name);   // ✅ must match backend
formData.append(
  "fileType",
  task.file.type.startsWith("video/") ? "video" : "image"
); // ✅ normalize type
formData.append("chunkIndex", i);
formData.append("totalChunks", task.totalChunks);
formData.append("chunk", task.chunks[i]);


        let res;
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            res = await axios.post(
           `${import.meta.env.VITE_API_BASE_URL_LOCAL}/uploads/chunk`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                onUploadProgress: () => {
                  const percent = Math.round(((i + 1) / task.totalChunks) * 100);
                  task.onProgress?.(percent);
                },
              },
            );
            break;
          } catch (err) {
            if (attempt === MAX_RETRIES) throw err;
            await new Promise((r) => setTimeout(r, 2000));
          }
        }

        if (res?.data?.url) {
          task.onSuccess?.(res.data.url);
        }
      }
    } catch (err) {
      task.onError?.(err);
    } finally {
      this.active = false;
      this.process();
    }
  }
}

export const uploadQueue = new UploadQueue();
