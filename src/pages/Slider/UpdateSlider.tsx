import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSliderById, selectSliderImages, selectSliderStatus, selectSliderError } from "../../app/reducer/sliderSlice";
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
  const [loading, setLoading] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false); // Track if the image is removed

  useEffect(() => {
    if (!slider && status === "idle") {
      dispatch(fetchSliderById(parseInt(id!))); // Fetch slider by ID if not already available
    }
  }, [dispatch, status, id, slider]);

  // Handle form submission for updating slider
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // If no image is selected and the current image is removed, show an alert
    if (!image && imageRemoved) {
      alert("Please select an image or add a new one.");
      return;
    }
  
    const formData = new FormData();
    if (image) {
      formData.append("image", image); // Add new image if selected
    }
    if (imageRemoved) {
      formData.append("remove_image", "true"); // Add flag for removing image
    }
  
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:8000/api/slider/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // If the response is successful
      if (response.status === 200) {
        setLoading(false);
        navigate("/slider-list"); // Redirect to the slider list after successful update
      } else {
        setLoading(false);
        alert("Failed to update slider, please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      console.error("Error details:", err);
      if (err.response) {
        // If the error has a response object (for example, from the backend)
        console.error("Backend error message:", err.response.data);
        alert(`Error updating slider: ${err.response.data.message || err.response.statusText}`);
      } else {
        console.error("Error without response:", err);
        alert("Error updating slider.");
      }
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
          {/* Display current image if exists */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slider Image</label>
            <div className="flex items-center gap-3">
              {slider.image && !imageRemoved ? (
                <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                  <img
                    src={`http://localhost:8000/storage/${slider.image}`} // Current image
                    className="h-[50px] w-[50px] object-cover"
                    alt="Slider Image"
                  />
                  <Button
                    type="button"
                    onClick={() => setImageRemoved(true)} // Mark image as removed
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

          {/* Input to select new image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Slider Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files ? e.target.files[0] : null);
                setImageRemoved(false); // Reset removed state when a new file is selected
              }}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Submit Button */}
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
