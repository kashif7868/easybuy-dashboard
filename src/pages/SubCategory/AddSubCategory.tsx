import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSubCategory } from '../../app/reducer/subCategorySlice'; // Import createSubCategory action
import { useNavigate } from 'react-router-dom'; // For redirecting after creating subcategory
import Button from '../../components/ui/button/Button'; // Assuming you have a Button component

const AddSubCategory: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form data for subcategory creation
  const [subCategoryData, setSubCategoryData] = useState({
    subCategoryName: '',
    category_name: '',
    category_id: '', // This should ideally be selected from a list of categories
    image: null as File | null,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle input change for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSubCategoryData((prevData) => ({
        ...prevData,
        image: e.target.files[0], // Set the selected image file
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subCategoryData.subCategoryName || !subCategoryData.image || !subCategoryData.category_id) {
      setError('All fields are required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create a new FormData object to send the form data, including the image file
    const formData = new FormData();
    formData.append('subCategoryName', subCategoryData.subCategoryName);
    formData.append('category_name', subCategoryData.category_name);
    formData.append('category_id', subCategoryData.category_id);
    formData.append('image', subCategoryData.image);

    try {
      // Dispatch the createSubCategory action to send the data to the backend
      await dispatch(createSubCategory(formData));

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

        {/* Category ID */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category ID</label>
          <input
            type="text"
            id="category_id"
            name="category_id"
            value={subCategoryData.category_id}
            onChange={handleInputChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Subcategory Image</label>
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
            {isLoading ? 'Creating...' : 'Add Subcategory'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSubCategory;
