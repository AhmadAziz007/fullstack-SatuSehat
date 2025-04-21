import { createContext, useEffect, useState } from 'react';
import { fetchCategories } from '../service/CategoryService';
import { fetchItems } from '../service/ItemService';

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchCategories();
        const itemResponse = await fetchItems();
        setCategories(response.data);
        setItems(itemResponse.data)
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    loadData();
  }, []);

  const contextValue = {
    categories,
    setCategories,
    items,
    setItems
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};