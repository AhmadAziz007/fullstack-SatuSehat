import axios from "axios";

export const addItems = async (items) => {
  return await axios.post(`http://localhost:8081/api/v1.0/items`, items);
}

export const updateItem = async (itemId, itemData) => {
  return await axios.put(
    `http://localhost:8081/api/v1.0/items/${itemId}`,
    itemData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
}


export const fetchItems = async () => {
  return await axios.get(`http://localhost:8081/api/v1.0/items`);
}

export const deleteItems = async (itemId) => {
  return await axios.delete(`http://localhost:8081/api/v1.0/items/${itemId}`);
}