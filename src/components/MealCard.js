import { motion, useReducedMotion } from "framer-motion";
import { onImageError, previewThumb } from "../lib/image";

const MealCard = ({ meal, onSelect }) => {
  const reduced = useReducedMotion();
  const name = meal.strMeal || "Unknown dish";
  return (
    <motion.article
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={reduced ? false : { opacity: 0, scale: 0.95 }}
      animate={reduced ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : 0.3 }}
    >
      <button
        type="button"
        onClick={() => onSelect(meal)}
        aria-label={`Open recipe for ${name}`}
        className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-inset"
      >
        <div className="aspect-[4/3] w-full bg-gray-100">
          <img
            src={previewThumb(meal.strMealThumb)}
            alt={name}
            width="400"
            height="300"
            loading="lazy"
            decoding="async"
            onError={onImageError}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 pb-0">
          <h3 className="text-xl font-semibold">{name}</h3>
          {meal.strCategory && (
            <p className="text-gray-600 text-sm">Category: {meal.strCategory}</p>
          )}
        </div>
      </button>
      <div className="px-4 pb-4 pt-2">
        {meal.strSource && (
          <a
            href={meal.strSource}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View recipe source for ${name} (opens in a new tab)`}
            className="text-red-700 text-sm hover:underline inline-block"
          >
            View Recipe
          </a>
        )}
      </div>
    </motion.article>
  );
};

export default MealCard;
