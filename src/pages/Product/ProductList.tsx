import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  selectProducts,
  selectProductStatus,
  selectProductError,
  deleteProduct,
} from '../../app/reducer/productSlice'; // Correct import
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'; // React icons for actions
import Button from '../../components/ui/button/Button'; // Assuming you have a Button component
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table"; // Assuming you have table components

// Define the interface for the product data
interface Product {
  id: number;
  name: string;
  price: string;
  discount_price: string;
  discount_percentage: string;
  rating: number;
  reviews: number;
  description: string;
  images: string;
  additional_images: string[];
  color: string;
  brand: string;
  meter: string;
  size: string;
  items_stock: number;
  category_id: number;
  subcategory_id: number;
  small_category_id: number;
  featured: boolean;
  deal_of_the_day: boolean;
  best_seller: boolean;
  top_offer_product: boolean;
  created_at: string;
  updated_at: string;
  category: {
    category_name: string;
  };
  subcategory: {
    subCategoryName: string;
  };
  small_category: {
    small_category_name: string;
  };
}

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts); // Selector to get the list of products
  const status = useSelector(selectProductStatus);
  const error = useSelector(selectProductError);

  // Fetch products on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Handle loading and error states
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
  }

  if (status === 'failed') {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600">
        Error: {error}
      </div>
    );
  }

  // Handle product deletion
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id)); // Dispatch delete product action
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Product List</h3>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Sr. No.
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Product Name
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Category
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Subcategory
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Small Category
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Price
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.map((product: Product, index: number) => (
              <TableRow key={product.id}>
                <TableCell className="py-3">{index + 1}</TableCell> {/* Serial Number */}
                <TableCell className="py-3">{product.name}</TableCell>
                <TableCell className="py-3">{product.category.category_name}</TableCell>
                <TableCell className="py-3">{product.subcategory.subCategoryName}</TableCell>
                <TableCell className="py-3">{product.small_category.small_category_name}</TableCell>
                <TableCell className="py-3">{product.price}</TableCell>
                <TableCell className="py-3">
                  <Button className="mr-2">
                    <FaEye /> {/* View Icon */}
                  </Button>
                  <Button className="mr-2" onClick={() => alert(`Editing product with ID: ${product.id}`)}>
                    <FaEdit /> {/* Edit Icon */}
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(product.id)}>
                    <FaTrash /> {/* Delete Icon */}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductList;
