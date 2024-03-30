import FormData from 'form-data';
import axios from 'axios';
import { createReadStream } from 'fs';
import { ApiError } from '../../../middlewares';

type ImageUploadResponse = { data: { url: string } };

export class ImgbbService {
  private readonly BASE_URL = process.env.IMGBB_API_BASE_URL as string;

  async uploadImage(image: string): Promise<string> {
    const payload = new FormData();

    payload.append('key', process.env.IMGBB_API_KEY);
    payload.append('image', createReadStream(image));

    try {
      const response = await axios.post<ImageUploadResponse>(
        this.BASE_URL,
        payload,
      );

      return response.data.data.url;
    } catch {
      throw new ApiError('Image upload failed', 500);
    }
  }
}

export const imgbbService = new ImgbbService();
