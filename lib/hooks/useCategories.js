import { useState, useEffect } from "react";
import { api } from "../api";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const selectCategory = async (categoryId) => {
    setLoading(true);
    setError(null);
    try {
      // The backend returns just the books array, not a category object
      const booksData = await api.getCategoryBooks(categoryId);

      // Find the category from our existing list
      const category = categories.find((c) => c.id === categoryId);
      setSelectedCategory(category);
      setBooks(booksData);
    } catch (err) {
      setError(err.message || "Failed to fetch category books");
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    selectedCategory,
    books,
    loading,
    error,
    selectCategory,
  };
};
