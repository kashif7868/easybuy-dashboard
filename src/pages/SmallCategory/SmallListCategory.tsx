import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSmallCategories,
  selectSmallCategories,
  selectSmallCategoryStatus,
  selectSmallCategoryError,
  deleteSmallCategory,
} from '../../app/reducer/smallCategorySlice';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table"; // Assuming you have these components
import Button from "../../components/ui/button/Button"; // Assuming you have a Button component
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'; // React icons for actions

// Define the interface for the small category data
interface SmallCategory {
  id: number;
  small_category_name: string;
  category_name: string;
  subcategory_name: string;
  created_at: string;
  updated_at: string;
}

const SmallCategoryList: React.FC = () => {
  const dispatch = useDispatch();
  const smallCategories = useSelector(selectSmallCategories); // Selector to get the list of small categories
  const status = useSelector(selectSmallCategoryStatus);
  const error = useSelector(selectSmallCategoryError);

  // Fetch small categories on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSmallCategories());
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

  // Handle small category deletion
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this small category?')) {
      dispatch(deleteSmallCategory(id)); // Dispatch delete small category action
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Small Category List</h3>
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
                Small Category Name
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
                Subcategory Name
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
            {smallCategories.map((smallCategory: SmallCategory, index: number) => (
              <TableRow key={smallCategory.id}>
                <TableCell className="py-3">{index + 1}</TableCell> {/* Serial Number */}
                <TableCell className="py-3">{smallCategory.small_category_name}</TableCell>
                <TableCell className="py-3">{smallCategory.category_name}</TableCell>
                <TableCell className="py-3">{smallCategory.subCategoryName}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(smallCategory.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(smallCategory.updated_at).toLocaleString()}
                </TableCell>
                <TableCell className="py-3">
                  <Button className="mr-2">
                    <FaEye /> {/* View Icon */}
                  </Button>
                  <Button className="mr-2" onClick={() => alert(`Editing small category with ID: ${smallCategory.id}`)}>
                    <FaEdit /> {/* Edit Icon */}
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(smallCategory.id)}>
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

export default SmallCategoryList;
