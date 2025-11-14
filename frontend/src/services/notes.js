import axios from "axios";
const baseUrl = "/api/notes";

// const getAll = () => axios.get(baseUrl).then((response) => response.data);
const getAll = () => {
  const fakeNote = {
    id: "30000",
    content: "fake note",
    important: false,
  };
  return axios.get(baseUrl).then((response) => {
    return response.data.concat(fakeNote);
  });
};

const create = (newObj) =>
  axios.post(baseUrl, newObj).then((response) => response.data);

const update = (id, newObj) =>
  axios.put(`${baseUrl}/${id}`, newObj).then((response) => response.data);

export default {
  getAll,
  create,
  update,
};
