import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCategory } from '../../app/reducer/categorySlice'; // Import createCategory action
import { useNavigate } from 'react-router-dom'; // For redirect after creating category
import Button from '../../components/ui/button/Button'; // Assuming you have a Button component

const AddCategory: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState({
    category_name: '',
    image: null as File | null,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle category name change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCategoryData((prevData) => ({
        ...prevData,
        image: e.target.files[0], // Set the selected image file
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryData.category_name || !categoryData.image) {
      setError('Category name and image are required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('category_name', categoryData.category_name);
    formData.append('image', categoryData.image);

    try {
      // Dispatch createCategory action
      await dispatch(createCategory(formData));

      // Redirect to category list page after successful creation
      navigate('/category-list');
    } catch (err) {
      setError('Error creating category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">Add New Category</h3>

      {/* Display error message if any */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 mb-4 rounded-md">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Name */}
        <div>
          <label htmlFor="category_name" className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            id="category_name"
            name="category_name"
            value={categoryData.category_name}
            onChange={handleInputChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Category Image</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating...' : 'Add Category'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
