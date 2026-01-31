import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

async function getUrl(content) {
  try {
    const response = await api.post("/api/pastes", {
      content: content,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default getUrl;
