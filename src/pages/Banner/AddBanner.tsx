import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createBanner } from '../../app/reducer/bannerSlice';
import Button from "../../components/ui/button/Button";

// Dummy categories for example. Replace with actual categories from your API or database.
const categories = [
  { id: '1', name: 'Athleisure' },
  { id: '2', name: 'Casual Wear' },
  { id: '3', name: 'Formal Wear' },
];

interface BannerForm {
  image: File | null;
  category_id: string;
  category_name: string;
  subcategory_name: string;
}

const AddBanner: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BannerForm>({
    image: null,
    category_id: '',
    category_name: '',
    subcategory_name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const category = categories.find((cat) => cat.id === value);
    if (category) {
      setFormData((prevData) => ({
        ...prevData,
        category_id: category.id,
        category_name: category.name,
      }));
    }
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prevData) => ({
        ...prevData,
        image: e.target.files[0],
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image || !formData.category_id || !formData.subcategory_name) {
      setError('All fields are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create FormData object
    const form = new FormData();
    form.append('image', formData.image);
    form.append('category_id', formData.category_id); // Ensure category_id is set
    form.append('category_name', formData.category_name);
    form.append('subcategory_name', formData.subcategory_name);

    try {
      // Dispatch the createBanner action to add the banner
      await dispatch(createBanner(form));

      // Redirect to the banner list page after successful creation
      navigate('/banner-list'); // Navigate to banner list page
    } catch (err) {
      setError('Error creating banner. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">Add Banner</h3>

      {/* Display error message if any */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 mb-4 rounded-md">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Selection */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleCategoryChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Name */}
        <div>
          <label htmlFor="subcategory_name" className="block text-sm font-medium text-gray-700">Subcategory Name</label>
          <input
            type="text"
            id="subcategory_name"
            name="subcategory_name"
            value={formData.subcategory_name}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Banner Image</label>
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
            {isLoading ? 'Creating...' : 'Add Banner'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBanner;
