import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import ErrorState from "./ErrorState";

const getIngredients = (meal) => {
  const out = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      out.push(`${meas ? meas.trim() + " " : ""}${ing.trim()}`);
    }
  }
  return out;
};

const toYouTubeEmbed = (url) => {
  if (!url) return null;
  const m = url.match(/[?&]v=([^&]+)/);
  return m ? `https://www.youtube.com/watch?v=${m[1]}` : url;
};

const MealModal = ({ mealId, onClose }) => {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const closeBtnRef = useRef(null);
  const prevFocusRef = useRef(null);
  const titleId = "meal-modal-title";

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(mealId)}`
      );
      setMeal(res.data.meals ? res.data.meals[0] : null);
    } catch (e) {
      setError("Failed to load recipe details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    prevFocusRef.current = document.activeElement;
    load();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      if (prevFocusRef.current && prevFocusRef.current.focus) {
        prevFocusRef.current.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealId]);

  useEffect(() => {
    if (!loading && closeBtnRef.current) closeBtnRef.current.focus();
  }, [loading]);

  const ingredients = meal ? getIngredients(meal) : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-4 border-b sticky top-0 bg-white">
          <h2 id={titleId} className="text-2xl font-bold pr-4">
            {meal ? meal.strMeal : "Recipe"}
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close recipe details"
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Close
          </button>
        </div>

        <div className="p-4">
          {loading && <Loader label="Loading recipe..." />}
          {error && <ErrorState message={error} onRetry={load} />}
          {!loading && !error && meal && (
            <>
              {meal.strMealThumb && (
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
              )}
              <div className="text-sm text-gray-600 mb-4">
                {meal.strCategory && <span className="mr-3">Category: {meal.strCategory}</span>}
                {meal.strArea && <span>Cuisine: {meal.strArea}</span>}
              </div>

              {ingredients.length > 0 && (
                <section className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-800">
                    {ingredients.map((ing, i) => (
                      <li key={`${mealId}-ing-${i}`}>{ing}</li>
                    ))}
                  </ul>
                </section>
              )}

              {meal.strInstructions && (
                <section className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                  <p className="whitespace-pre-line text-gray-800">{meal.strInstructions}</p>
                </section>
              )}

              <div className="flex flex-wrap gap-3 mt-2">
                {meal.strYoutube && (
                  <a
                    href={toYouTubeEmbed(meal.strYoutube)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline"
                  >
                    Watch on YouTube
                  </a>
                )}
                {meal.strSource && (
                  <a
                    href={meal.strSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline"
                  >
                    View Recipe Source
                  </a>
                )}
              </div>
            </>
          )}
          {!loading && !error && !meal && (
            <p className="text-gray-600">Recipe not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealModal;
