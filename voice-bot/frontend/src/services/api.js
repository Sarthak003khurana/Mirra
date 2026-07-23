import axios from 'axios';

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});


// =========================
// ERROR HANDLING
// =========================
api.interceptors.response.use(
  (response) => response,

  (error) => {

    console.error(
      'API Error:',
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);


// =========================
// UPLOAD RESUME
// =========================
export const uploadResume = (
  file,
  onProgress
) => {

  const formData = new FormData();

  // IMPORTANT:
  // FastAPI expects "file"
  formData.append('file', file);

  return api.post(
    '/upload-resume',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },

      onUploadProgress: (e) => {

        if (onProgress) {

          onProgress(
            Math.round(
              (e.loaded * 100) / e.total
            )
          );
        }
      },
    }
  );
};


// =========================
// GET QUESTION
// =========================
export const getQuestion = () =>
  api.get('/question');


// =========================
// SUBMIT ANSWER
// =========================
export const submitAnswer = (answer) =>
  api.post(
    '/answer',
    null,
    {
      params: { answer }
    }
  );


// =========================
// ROOT TEST
// =========================
export const testBackend = () =>
  api.get('/');


export default api;