import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import 'tailwindcss/tailwind.css';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.div
        className="w-16 h-16 border-4 border-t-red-500 border-gray-300 rounded-full animate-spin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity }}
      ></motion.div>
      <p className="text-lg font-semibold text-gray-700 mt-4">Fetching cuisines...</p>
    </div>
  );
};

const CuisinesPage = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await axios.get("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        setMeals(response.data.meals || []);
      } catch (err) {
        setError("Failed to fetch cuisines.");
      } finally {
        setLoading(false);
      }
    };
    fetchCuisines();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🍽️ World Cuisines</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={meal.strMealThumb || "https://via.placeholder.com/128x128?text=No+Image"}
              alt={meal.strMeal}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{meal.strMeal || "Unknown Dish"}</h2>
              <p className="text-gray-600 text-sm">Category: {meal.strCategory || "N/A"}</p>
              <a
                href={meal.strSource || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 text-sm hover:underline mt-2 block"
              >
                View Recipe
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CuisinesPage;
