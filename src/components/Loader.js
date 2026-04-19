import { motion, useReducedMotion } from "framer-motion";

const Loader = ({ label = "Fetching cuisines..." }) => {
  const reduced = useReducedMotion();
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-16"
    >
      <motion.div
        className={`w-16 h-16 border-4 border-t-red-500 border-gray-300 rounded-full ${
          reduced ? "" : "animate-spin"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.5 }}
      />
      <p className="text-lg font-semibold text-gray-700 mt-4">{label}</p>
    </div>
  );
};

export default Loader;
