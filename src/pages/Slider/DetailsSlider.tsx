import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSliderById, selectSliderImages, selectSliderStatus, selectSliderError } from "../../app/reducer/sliderSlice";
import { useParams } from "react-router-dom";
import Button from "../../components/ui/button/Button";

// Define the interface for the slider data
interface Slider {
  id: number;
  image: string;
  created_at: string;
  updated_at: string;
}

export default function DetailsSlider() {
  const { id } = useParams<{ id: string }>(); // Get slider ID from URL
  const dispatch = useDispatch();
  const slider = useSelector(selectSliderImages).find((slider) => slider.id === parseInt(id)); // Find the slider by ID
  const status = useSelector(selectSliderStatus);
  const error = useSelector(selectSliderError);

  // Fetch the slider details if not already fetched
  useEffect(() => {
    if (!slider && status === "idle") {
      dispatch(fetchSliderById(parseInt(id!))); // Fetch slider by ID if not already available
    }
  }, [dispatch, status, id, slider]);

  // Handle loading and error states
  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
  }

  if (status === "failed") {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Slider Details</h3>

      {slider ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={`http://localhost:8000/storage/${slider.image}`} // Image source from backend
              alt="Slider Image"
              className="w-full h-72 object-cover mb-4"
            />
          </div>
          <div>
            <p><strong>ID:</strong> {slider.id}</p>
            <p><strong>Created At:</strong> {new Date(slider.created_at).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(slider.updated_at).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <div className="text-center">Slider not found.</div>
      )}

      <Button onClick={() => window.history.back()} className="mt-4">Back to List</Button>
    </div>
  );
}
