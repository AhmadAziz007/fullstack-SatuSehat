import axios from "axios";

export const addCategory = async (category) => {
  return await axios.post(`http://localhost:8081/api/v1.0/categories`, category);
}

export const updateCategory = async (categoryId, categoryData) => {
  return await axios.put(
    `http://localhost:8081/api/v1.0/categories/${categoryId}`,
    categoryData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
}

export const deleteCategory = async (categoryId) => {
  return await axios.delete(`http://localhost:8081/api/v1.0/categories/${categoryId}`);
}

export const fetchCategories = async () => {
  return await axios.get(`http://localhost:8081/api/v1.0/categories`);
}  