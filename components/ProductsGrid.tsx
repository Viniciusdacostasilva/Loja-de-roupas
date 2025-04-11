import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: string;
  description: string | null;
  imageUrl: string;
  category: string;
}

interface ProductsGridProps {
  products: Product[];
  darkMode: boolean;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, darkMode }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg p-4 shadow-md transition-transform transform hover:scale-105 min-h-[400px] flex flex-col"
        >
          <div className="w-full sm:h-[300px] md:h-[450px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col flex-grow justify-between mt-2">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p
              className={`${
                darkMode ? "text-gray-300" : "text-gray-800"
              }`}
            >
              R$ {product.price}
            </p>
            <Link
              href={`admin/products/view/${product.id}`}
              className={`block mt-2 bg-black text-white px-4 py-2 text-center rounded ${
                darkMode
                  ? "hover:bg-white hover:text-light-black"
                  : "hover:bg-light-black hover:text-white"
              }`}
            >
              Ver Detalhes
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;