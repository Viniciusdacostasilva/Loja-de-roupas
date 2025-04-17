interface CategoriesSidebarProps {
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    darkMode: boolean;
  }
  
  const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({
    categories,
    selectedCategory,
    setSelectedCategory,
    darkMode,
  }) => {
    return (
      <aside className="min-w-64 p-6  md:border-r border-gray-300 dark:border-black md:block">
        <h3
          className={`text-xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Categorias
        </h3>
        <nav className="flex sm:flex-row md:flex-col gap-2 w-max">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 w-[150px] py-2 rounded text-left border-solid border-2 ${
                selectedCategory === category
                  ? "bg-white-buttons text-black"
                  : darkMode
                  ? "bg-background-black text-white hover:bg-gray-300 hover:text-black"
                  : "bg-background-black text-white hover:bg-white hover:text-black"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>
      </aside>
    );
  };
  
  export default CategoriesSidebar;