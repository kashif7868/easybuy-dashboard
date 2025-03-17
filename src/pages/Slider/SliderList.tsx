import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSliderImages,
  selectSliderImages,
  selectSliderStatus,
  selectSliderError,
  deleteSliderImage,
} from "../../app/reducer/sliderSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Define the interface for the slider data
interface Slider {
  id: number;
  image: string;
  created_at: string;
  updated_at: string;
}

export default function SliderList() {
  const dispatch = useDispatch();
  const sliders = useSelector(selectSliderImages);
  const status = useSelector(selectSliderStatus);
  const error = useSelector(selectSliderError);
  const navigate = useNavigate(); // Initialize useNavigate

  const [searchQuery, setSearchQuery] = useState("");

  // Fetch slider images on component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSliderImages());
    }
  }, [dispatch, status]);

  // Handle the different loading states
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

  // Handle the delete functionality
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      dispatch(deleteSliderImage(id));
    }
  };

  // Navigate to the slider details page
  const handleView = (id: number) => {
    navigate(`/slider-details/${id}`); // Use navigate to go to the details page
  };

  // Navigate to the slider edit page
  const handleEdit = (id: number) => {
    navigate(`/slider-edit/${id}`); // Use navigate to go to the edit page
  };

  // Filter sliders based on the search query
  const filteredSliders = sliders.filter(
    (slider) =>
      slider.image.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by image or any other attribute
      slider.id.toString().includes(searchQuery) // Allow searching by ID as well
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Slider List</h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <input
            type="text"
            className="border border-gray-300 px-4 py-2 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            placeholder="Search by ID or image..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Sr. No.
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Slider Image
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Created At
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Updated At
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredSliders.map((slider, index) => (
              <TableRow key={slider.id}>
                <TableCell className="py-3">{index + 1}</TableCell> {/* Serial number */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src={`http://localhost:8000/storage/${slider.image}`} // Updated image path
                        className="h-[50px] w-[50px] object-cover"
                        alt="Slider Image"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(slider.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(slider.updated_at).toLocaleString()}
                </TableCell>
                <TableCell className="py-3">
                  <Button onClick={() => handleView(slider.id)} className="mr-2">
                    View
                  </Button>
                  <Button onClick={() => handleEdit(slider.id)} className="mr-2">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(slider.id)} variant="danger">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
