import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners, selectBanners, selectBannerStatus, selectBannerError, deleteBanner } from '../../app/reducer/bannerSlice';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'; // Importing React Icons
import { Link } from 'react-router-dom'; // Import Link for navigation

// Define the interface for the banner data
interface Banner {
  id: number;
  image: string;
  category_name: string;
  subcategory_name: string;
  category_id: string;
  updated_at: string;
  created_at: string;
}

const BannerList: React.FC = () => {
  const dispatch = useDispatch();
  const banners = useSelector(selectBanners);
  const status = useSelector(selectBannerStatus);
  const error = useSelector(selectBannerError);

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch banner data on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBanners());
    }
  }, [dispatch, status]);

  // Handle the different loading states
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
  }

  if (status === 'failed') {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600">
        Error: {error}
      </div>
    );
  }

  // Filter banners based on the search query (search by category, subcategory, or image)
  const filteredBanners = banners.filter(
    (banner) =>
      banner.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.subcategory_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.image.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      dispatch(deleteBanner(id)); // Dispatch delete action
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Banner List</h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <input
            type="text"
            className="border border-gray-300 px-4 py-2 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            placeholder="Search by category, subcategory, or image..."
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
                Image
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Category Name
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Subcategory Name
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
            {filteredBanners.map((banner, index) => (
              <TableRow key={banner.id}>
                <TableCell className="py-3">{index + 1}</TableCell> {/* Serial Number */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src={`http://localhost:8000/storage/${banner.image}`} // Correct image path
                        className="h-[50px] w-[50px] object-cover"
                        alt="Banner Image"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {banner.category_name}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {banner.subcategory_name}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(banner.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(banner.updated_at).toLocaleString()}
                </TableCell>
                <TableCell className="py-3">
                  <Link to={`/view-banner/${banner.id}`} className="mr-2">
                    <Button className="mr-2">
                      <FaEye /> {/* View Icon */}
                    </Button>
                  </Link>
                  <Link to={`/update-banner/${banner.id}`} className="mr-2">
                    <Button className="mr-2">
                      <FaEdit /> {/* Edit Icon */}
                    </Button>
                  </Link>
                  <Button variant="danger" onClick={() => handleDelete(banner.id)}>
                    <FaTrash /> {/* Delete Icon */}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BannerList;
