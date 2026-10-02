import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import ErrorState from "./ErrorState";
import { onImageError } from "../lib/image";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const prevFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = "meal-modal-title";

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const load = useCallback(async () => {
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
  }, [mealId]);

  useEffect(() => {
    load();
  }, [load]);

  // Focus management: remember the opener, move focus into the dialog, trap Tab,
  // close on Escape, and hand focus back to the opener on unmount.
  useEffect(() => {
    prevFocusRef.current = document.activeElement;
    closeBtnRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const nodes = dialogRef.current.querySelectorAll(FOCUSABLE);
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (!dialogRef.current.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      const prev = prevFocusRef.current;
      if (prev && typeof prev.focus === "function" && document.contains(prev)) {
        prev.focus();
      }
    };
  }, []);

  const ingredients = meal ? getIngredients(meal) : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
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
                <div className="aspect-[16/9] w-full bg-gray-100 rounded-md overflow-hidden mb-4">
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    width="700"
                    height="394"
                    loading="lazy"
                    decoding="async"
                    onError={onImageError}
                    className="w-full h-full object-cover"
                  />
                </div>
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
                    className="text-red-700 hover:underline"
                  >
                    Watch on YouTube
                  </a>
                )}
                {meal.strSource && (
                  <a
                    href={meal.strSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-700 hover:underline"
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
