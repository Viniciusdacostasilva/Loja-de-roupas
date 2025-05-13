interface CategoriesProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  darkMode: boolean;
}

const Categories: React.FC<CategoriesProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  darkMode,
}) => {
  return (
    <section className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-left">Categorias</h2>
      <div
        className="flex gap-4 overflow-x-auto lg:grid lg:grid-cols-4 lg:gap-4 scrollbar-hide"
      >
        {categories.map((category) => (
          <button
            key={category}
            className={`flex-shrink-0 sm:w-[220px] md:w-[320px] lg:w-auto h-[120px] overflow-hidden rounded-md border transition-all ${
              selectedCategory === category
                ? "bg-white-buttons text-black border-black"
                : darkMode
                ? "bg-background-black text-white border-gray-600 hover:bg-gray-300 hover:text-black hover:border-gray-500"
                : "bg-background-black text-white border-gray-300 hover:bg-white hover:text-black hover:border-gray-400"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            <div className="flex items-center justify-center h-full bg-black/20 group-hover:bg-black/30 transition-all">
              <span className="text-sm font-medium">{category}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Categories;