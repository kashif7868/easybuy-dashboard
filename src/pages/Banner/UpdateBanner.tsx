import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { fetchBannerById, updateBanner, selectSelectedBanner, selectBannerStatus, selectBannerError } from '../../app/reducer/bannerSlice';

const UpdateBanner: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Retrieve the id from the URL params
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const banner = useSelector(selectSelectedBanner);
  const status = useSelector(selectBannerStatus);
  const error = useSelector(selectBannerError);

  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (status === 'idle' && id) {
      dispatch(fetchBannerById(Number(id))); // Fetch the banner by id
    }
  }, [dispatch, status, id]);

  useEffect(() => {
    if (banner) {
      setCategoryName(banner.category_name);
      setSubcategoryName(banner.subcategory_name);
    }
  }, [banner]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append('image', image);
    formData.append('category_name', categoryName);
    formData.append('subcategory_name', subcategoryName);

    dispatch(updateBanner({ id: Number(id), formData }))
      .then(() => {
        navigate('/banners');
      })
      .catch((err) => {
        console.error('Update failed: ', err);
      });
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Banner</h2>
      {banner && (
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label htmlFor="categoryName" className="block text-lg font-medium text-gray-700">Category Name</label>
            <input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="subcategoryName" className="block text-lg font-medium text-gray-700">Subcategory Name</label>
            <input
              id="subcategoryName"
              type="text"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-lg font-medium text-gray-700">Image</label>
            <input
              id="image"
              type="file"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {status === 'loading' ? 'Updating...' : 'Update Banner'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateBanner;
