import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createSmallCategory } from '../../app/reducer/smallCategorySlice'; // Import createSmallCategory action
import { useNavigate } from 'react-router-dom'; // For redirecting after creating small category
import Button from '../../components/ui/button/Button'; // Assuming you have a Button component

const AddSmallCategory: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form data for small category creation
  const [smallCategoryData, setSmallCategoryData] = useState({
    small_category_name: '',
    category_id: '', // This should ideally be selected from a list of categories
    subcategory_id: '', // This should ideally be selected from a list of subcategories
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle input change for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSmallCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!smallCategoryData.small_category_name || !smallCategoryData.category_id || !smallCategoryData.subcategory_id) {
      setError('All fields are required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create a new FormData object to send the form data
    const formData = new FormData();
    formData.append('small_category_name', smallCategoryData.small_category_name);
    formData.append('category_id', smallCategoryData.category_id);
    formData.append('subcategory_id', smallCategoryData.subcategory_id);

    try {
      // Dispatch the createSmallCategory action to send the data to the backend
      await dispatch(createSmallCategory(formData));

      // Redirect to the small category list page after successful creation
      navigate('/small-category-list');
    } catch (err) {
      setError('Error creating small category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">Add New Small Category</h3>

      {/* Display error message if any */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 mb-4 rounded-md">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Small Category Name */}
        <div>
          <label htmlFor="small_category_name" className="block text-sm font-medium text-gray-700">Small Category Name</label>
          <input
            type="text"
            id="small_category_name"
            name="small_category_name"
            value={smallCategoryData.small_category_name}
            onChange={handleInputChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category ID */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category ID</label>
          <input
            type="text"
            id="category_id"
            name="category_id"
            value={smallCategoryData.category_id}
            onChange={handleInputChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Subcategory ID */}
        <div>
          <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700">Subcategory ID</label>
          <input
            type="text"
            id="subcategory_id"
            name="subcategory_id"
            value={smallCategoryData.subcategory_id}
            onChange={handleInputChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating...' : 'Add Small Category'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSmallCategory;
