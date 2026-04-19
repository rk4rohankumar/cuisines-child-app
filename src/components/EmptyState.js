const EmptyState = ({ message = "No dishes found. Try another search or category." }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <p className="text-gray-600">{message}</p>
  </div>
);

export default EmptyState;
