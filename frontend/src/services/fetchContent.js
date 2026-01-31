import axios from "axios";
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

async function getContent(id) {
  try {
    const response = await api.get(`/api/pastes/${id}`);
    console.log(response.data);
    return response.data.content;
  } catch (error) {
    console.log(error);
  }
}

export default getContent;
