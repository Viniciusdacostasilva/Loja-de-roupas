import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: string | number; // Pode ser string ou número
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
    <>
      <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.slice(0, 8).map((product) => (
          <div
            key={product.id}
            className="overflow-hidden h-full transition-all hover:shadow-md border rounded-lg"
          >
            <div className="relative w-full h-52">
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            {/* Conteúdo do card */}
            <div className="p-4">
              <h3
                className="font-medium text-base truncate"
                title={product.name} // Tooltip para exibir o nome completo
              >
                {product.name}
              </h3>
              <p
                className={`text-sm mb-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {product.category}
              </p>
              <p className="font-semibold text-base">
                R$ {Number(product.price).toFixed(2)}
              </p>
              <div className="mt-4">
                <Link
                  href={`/admin/products/view/${product.id}`}
                  className={`block text-center px-4 py-2 rounded-md font-medium ${
                    darkMode
                      ? "bg-white text-black hover:bg-gray-300"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  Ver detalhes
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductsGrid;