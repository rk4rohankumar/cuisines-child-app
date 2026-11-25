import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import Loader from "./components/Loader";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import MealCard from "./components/MealCard";
import MealModal from "./components/MealModal";
import useDebouncedValue from "./hooks/useDebouncedValue";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";
const DEFAULT_CATEGORY = "Seafood";

const CuisinesPage = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMealId, setSelectedMealId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_BASE}/list.php?c=list`)
      .then((res) => {
        if (cancelled) return;
        setCategories((res.data.meals || []).map((m) => m.strCategory));
      })
      .catch(() => {
        /* non-fatal */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = debouncedQuery.trim()
        ? `${API_BASE}/search.php?s=${encodeURIComponent(debouncedQuery.trim())}`
        : `${API_BASE}/filter.php?c=${encodeURIComponent(category)}`;
      const res = await axios.get(url);
      setMeals(res.data.meals || []);
    } catch (err) {
      setError("Failed to fetch cuisines.");
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, category]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const heading = useMemo(() => {
    if (debouncedQuery.trim()) return `Results for "${debouncedQuery.trim()}"`;
    return `${category} Dishes`;
  }, [debouncedQuery, category]);

  return (
    <section aria-labelledby="cuisines-heading" className="max-w-6xl mx-auto p-4">
      <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--mfe-accent,#047857)]">Cuisines remote</p>
      <h1 id="cuisines-heading" className="mt-1 mb-6 text-2xl font-semibold text-[color:var(--mfe-ink,#0f172a)]">
        World Cuisines
      </h1>

      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="flex-1">
          <label htmlFor="cuisine-search" className="sr-only">
            Search dishes
          </label>
          <input
            id="cuisine-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes (e.g. Arrabiata)"
            className="w-full px-4 py-2 border border-[color:var(--mfe-border,#e2e8f0)] rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
        <div>
          <label htmlFor="cuisine-category" className="sr-only">
            Filter by category
          </label>
          <select
            id="cuisine-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={!!debouncedQuery.trim()}
            className="w-full sm:w-auto px-4 py-2 border border-[color:var(--mfe-border,#e2e8f0)] rounded-md bg-[var(--mfe-surface,#ffffff)] focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
          >
            {categories.length === 0 && <option value={category}>{category}</option>}
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4" aria-live="polite">
        {heading}
      </h2>

      {loading && <Loader />}
      {!loading && error && <ErrorState message={error} onRetry={fetchMeals} />}
      {!loading && !error && meals.length === 0 && <EmptyState />}
      {!loading && !error && meals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <MealCard
              key={meal.idMeal}
              meal={meal}
              onSelect={(m) => setSelectedMealId(m.idMeal)}
            />
          ))}
        </div>
      )}

      {selectedMealId && (
        <MealModal
          mealId={selectedMealId}
          onClose={() => setSelectedMealId(null)}
        />
      )}
    </section>
  );
};

export default CuisinesPage;
