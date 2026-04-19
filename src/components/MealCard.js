import { motion, useReducedMotion } from "framer-motion";

const MealCard = ({ meal, onSelect }) => {
  const reduced = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(meal)}
      className="text-left bg-white rounded-lg shadow-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-400"
      initial={reduced ? false : { opacity: 0, scale: 0.95 }}
      animate={reduced ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : 0.3 }}
    >
      <img
        src={meal.strMealThumb || "https://via.placeholder.com/400x300?text=No+Image"}
        alt={meal.strMeal || "Dish image"}
        loading="lazy"
        decoding="async"
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{meal.strMeal || "Unknown Dish"}</h2>
        {meal.strCategory && (
          <p className="text-gray-600 text-sm">Category: {meal.strCategory}</p>
        )}
        {meal.strSource && (
          <a
            href={meal.strSource}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-red-500 text-sm hover:underline mt-2 inline-block"
          >
            View Recipe
          </a>
        )}
      </div>
    </motion.button>
  );
};

export default MealCard;
