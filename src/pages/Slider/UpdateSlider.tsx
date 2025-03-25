import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSliderById, selectSliderImages, selectSliderStatus, selectSliderError, updateSliderImage } from "../../app/reducer/sliderSlice";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/ui/button/Button";
import axios from "axios";

// Define the interface for the slider data
interface Slider {
  id: number;
  image: string;
  created_at: string;
  updated_at: string;
}

export default function UpdateSlider() {
  const { id } = useParams<{ id: string }>(); // Get slider ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const slider = useSelector(selectSliderImages).find((slider) => slider.id === parseInt(id)); // Find the slider by ID
  const status = useSelector(selectSliderStatus);
  const error = useSelector(selectSliderError);

  const [image, setImage] = useState<File | null>(null); // State for storing the new image
  const [imageRemoved, setImageRemoved] = useState(false); // Track if the image is removed
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slider && status === "idle") {
      dispatch(fetchSliderById(parseInt(id!))); // Fetch slider by ID if not already available
    }
  }, [dispatch, status, id, slider]);

  // Handle form submission for updating slider
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a FormData object to send the data
    const formData = new FormData();

    if (image) {
      formData.append("image", image); // Append the new image if selected
    }

    if (imageRemoved) {
      formData.append("remove_image", "true"); // Flag to remove the image
    }

    // Dispatch the updateSliderImage action
    setLoading(true);
    try {
      await dispatch(updateSliderImage({ id: parseInt(id!), formData })).unwrap();
      setLoading(false);
      navigate("/slider-list"); // Redirect to the slider list after successful update
    } catch (err) {
      setLoading(false);
      alert("Error updating slider.");
    }
  };

  if (status === "loading" || loading) {
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
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Update Slider</h3>

      {slider ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slider Image</label>
            <div className="flex items-center gap-3">
              {slider.image && !imageRemoved ? (
                <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                  <img
                    src={`http://localhost:8000/storage/${slider.image}`}
                    className="h-[50px] w-[50px] object-cover"
                    alt="Slider Image"
                  />
                  <Button
                    type="button"
                    onClick={() => setImageRemoved(true)}
                    variant="danger"
                    className="mt-2"
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div>No image selected.</div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Slider Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files ? e.target.files[0] : null);
                setImageRemoved(false); // Reset the remove image state
              }}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <Button type="submit" className="mt-4" disabled={loading}>
            {loading ? "Updating..." : "Update Slider"}
          </Button>
        </form>
      ) : (
        <div className="text-center">Slider not found.</div>
      )}

      <Button onClick={() => navigate("/slider-list")} className="mt-4">
        Back to List
      </Button>
    </div>
  );
}
