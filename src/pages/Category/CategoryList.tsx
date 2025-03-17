import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectCategories, selectCategoryStatus, selectCategoryError, deleteCategory } from '../../app/reducer/categorySlice'; // Use selectCategories instead of selectBanners
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'; // React icons for actions

// Define the interface for the category data
interface Category {
  id: number;
  category_name: string;
  image: string;
  created_at: string;
  updated_at: string;
}

const CategoryList: React.FC = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories); // Use selectCategories instead of selectBanners
  const status = useSelector(selectCategoryStatus);
  const error = useSelector(selectCategoryError);

  // Fetch category data on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  // Handle the different loading states
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

  // Handle category deletion
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Category List</h3>
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
                Image
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Category Name
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Created At
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Updated At
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
            {categories.map((category: Category, index: number) => (
              <TableRow key={category.id}>
                <TableCell className="py-3">{index + 1}</TableCell> {/* Serial Number */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src={`http://localhost:8000/storage/${category.image}`} // Correct image path
                        className="h-[50px] w-[50px] object-cover"
                        alt="Category Image"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {category.category_name}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(category.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(category.updated_at).toLocaleString()}
                </TableCell>
                <TableCell className="py-3">
                  <Button className="mr-2">
                    <FaEye /> {/* View Icon */}
                  </Button>
                  <Button className="mr-2" onClick={() => alert(`Editing category with ID: ${category.id}`)}>
                    <FaEdit /> {/* Edit Icon */}
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(category.id)}>
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

export default CategoryList;
