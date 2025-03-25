import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // Import useParams
import { fetchBannerById, selectSelectedBanner, selectBannerStatus, selectBannerError } from '../../app/reducer/bannerSlice';

const ViewBanner: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Retrieve the id from the URL params
  const dispatch = useDispatch();
  const banner = useSelector(selectSelectedBanner);
  const status = useSelector(selectBannerStatus);
  const error = useSelector(selectBannerError);

  useEffect(() => {
    if (status === 'idle' && id) {
      dispatch(fetchBannerById(Number(id))); // Fetch the banner by id
    }
  }, [dispatch, status, id]);

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Banner Details</h2>
      {banner && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <img
              src={`http://localhost:8000/storage/${banner.image}`}
              alt="Banner"
              className="h-64 w-full max-w-md object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">Category: <span className="text-gray-500">{banner.category_name}</span></p>
            <p className="text-lg font-medium text-gray-700">Subcategory: <span className="text-gray-500">{banner.subcategory_name}</span></p>
            <p className="text-lg font-medium text-gray-700">Created At: <span className="text-gray-500">{new Date(banner.created_at).toLocaleString()}</span></p>
            <p className="text-lg font-medium text-gray-700">Updated At: <span className="text-gray-500">{new Date(banner.updated_at).toLocaleString()}</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBanner;
