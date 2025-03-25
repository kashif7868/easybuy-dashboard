import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectCategories } from '../../app/reducer/categorySlice';
import { fetchSubCategories, selectSubCategories } from '../../app/reducer/subCategorySlice';
import { createSmallCategory } from '../../app/reducer/smallCategorySlice'; 
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/button/Button';

const AddSmallCategory: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select categories and subcategories from the Redux store
  const categories = useSelector(selectCategories);
  const subcategories = useSelector(selectSubCategories);

  const [smallCategoryData, setSmallCategoryData] = useState({
    small_category_name: '',
    category_id: '', 
    subcategory_id: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch categories on component mount
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // Fetch subcategories whenever the category_id changes
    if (smallCategoryData.category_id) {
      dispatch(fetchSubCategories(smallCategoryData.category_id));
    }
  }, [dispatch, smallCategoryData.category_id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSmallCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSmallCategoryData((prevData) => ({
      ...prevData,
      category_id: value,
      subcategory_id: '', // Reset subcategory ID when category changes
    }));
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSmallCategoryData((prevData) => ({
      ...prevData,
      subcategory_id: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!smallCategoryData.small_category_name || !smallCategoryData.category_id || !smallCategoryData.subcategory_id) {
      setError('All fields are required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('small_category_name', smallCategoryData.small_category_name);
    formData.append('category_id', smallCategoryData.category_id);
    formData.append('subcategory_id', smallCategoryData.subcategory_id);

    try {
      await dispatch(createSmallCategory(formData));
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

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Select Category</label>
          <select
            id="category_id"
            name="category_id"
            value={smallCategoryData.category_id}
            onChange={handleCategoryChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Dropdown */}
        <div>
          <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700">Select Subcategory</label>
          <select
            id="subcategory_id"
            name="subcategory_id"
            value={smallCategoryData.subcategory_id}
            onChange={handleSubCategoryChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!smallCategoryData.category_id} // Disable until a category is selected
          >
            <option value="">Select a subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.subCategoryName}
              </option>
            ))}
          </select>
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
