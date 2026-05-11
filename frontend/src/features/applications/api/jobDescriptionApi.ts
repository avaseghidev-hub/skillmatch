import { axiosClient } from "../../../api/axiosClient";
import axios from "axios";

/**
 * Extract job description text from an uploaded image using OCR.
 */
export const extractJobDescriptionFromImage = async (
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosClient.post(
      "/job-descriptions/extract-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.extractedText;
  } catch (error) {
    // Print detailed backend error for debugging
    if (axios.isAxiosError(error)) {
      console.error("OCR API Error:", error.response?.data);
      console.error("OCR API Status:", error.response?.status);
    }

    throw error;
  }
};