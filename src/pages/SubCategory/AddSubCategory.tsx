import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSubCategory } from '../../app/reducer/subCategorySlice';
import { fetchCategories, selectCategories, selectCategoryStatus, selectCategoryError } from '../../app/reducer/categorySlice';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/button/Button';

const AddSubCategory: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch categories
  const categories = useSelector(selectCategories);
  const categoryStatus = useSelector(selectCategoryStatus);
  const categoryError = useSelector(selectCategoryError);

  const [subCategoryData, setSubCategoryData] = useState({
    subCategoryName: '',
    category_name: '',
    category_id: '', // Removed image data field
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch categories when the component mounts
  useEffect(() => {
    if (categoryStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch]);

  // Handle input change for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSubCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subCategoryData.subCategoryName || !subCategoryData.category_id) {
      setError('All fields are required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Dispatch the createSubCategory action to send the data to the backend
      await dispatch(createSubCategory(subCategoryData));

      // Redirect to the subcategory list page after successful creation
      navigate('/subcategory-list');
    } catch (err) {
      setError('Error creating subcategory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">Add New Subcategory</h3>

      {/* Display error message if any */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 mb-4 rounded-md">{error}</div>
      )}

      {/* Display category loading/error */}
      {categoryStatus === 'loading' && <p>Loading categories...</p>}
      {categoryError && <p className="text-red-500">{categoryError}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subcategory Name */}
        <div>
          <label htmlFor="subCategoryName" className="block text-sm font-medium text-gray-700">Subcategory Name</label>
          <input
            type="text"
            id="subCategoryName"
            name="subCategoryName"
            value={subCategoryData.subCategoryName}
            onChange={handleInputChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category Name */}
        <div>
          <label htmlFor="category_name" className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            id="category_name"
            name="category_name"
            value={subCategoryData.category_name}
            onChange={handleInputChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category ID (Dropdown from categories) */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category_id"
            name="category_id"
            value={subCategoryData.category_id}
            onChange={handleInputChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating...' : 'Add Subcategory'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSubCategory;
