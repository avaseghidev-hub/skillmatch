import { axiosClient } from "../../../api/axiosClient";

/**
 * Extract raw text from a resume PDF file.
 */
export const extractResumeText = async (
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post(
    "/resume/extract",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "text",
    }
  );

  return response.data;
};