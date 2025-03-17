import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubCategories, selectSubCategories, selectSubCategoryStatus, selectSubCategoryError, deleteSubCategory } from '../../app/reducer/subCategorySlice';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table"; // Assuming you have these components
import Button from "../../components/ui/button/Button"; // Assuming you have a Button component
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'; // React icons for actions

// Define the interface for the subcategory data
interface SubCategory {
  id: number;
  subCategoryName: string;
  category_name: string;
  created_at: string;
  updated_at: string;
}

const SubCategoryList: React.FC = () => {
  const dispatch = useDispatch();
  const subCategories = useSelector(selectSubCategories); // Selector to get the list of subcategories
  const status = useSelector(selectSubCategoryStatus);
  const error = useSelector(selectSubCategoryError);

  // Fetch subcategories on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSubCategories());
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

  // Handle subcategory deletion
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      dispatch(deleteSubCategory(id)); // Dispatch delete subcategory action
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Subcategory List</h3>
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
            {subCategories.map((subCategory: SubCategory, index: number) => (
              <TableRow key={subCategory.id}>
                <TableCell className="py-3">{index + 1}</TableCell> {/* Serial Number */}
                <TableCell className="py-3">{subCategory.category_name}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {subCategory.subCategoryName}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(subCategory.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(subCategory.updated_at).toLocaleString()}
                </TableCell>
                <TableCell className="py-3">
                  <Button className="mr-2">
                    <FaEye /> {/* View Icon */}
                  </Button>
                  <Button className="mr-2" onClick={() => alert(`Editing subcategory with ID: ${subCategory.id}`)}>
                    <FaEdit /> {/* Edit Icon */}
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(subCategory.id)}>
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

export default SubCategoryList;
