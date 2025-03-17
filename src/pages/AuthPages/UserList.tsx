import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, updateUser } from '../../app/reducer/userListSlice'; // Assuming these actions exist
import { FaTrash, FaPen, FaEye } from 'react-icons/fa'; // For icons (delete, edit, view)
import Button from '../../components/ui/button/Button'; // Assuming you have a Button component
import { useNavigate } from 'react-router-dom'; // For navigating to Order Detail page

const UserList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get users, status, and error from the Redux store
  const { users, loading, error } = useSelector((state: any) => state.users); // Assuming you have the users state

  useEffect(() => {
    // Fetch users when the component mounts
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  // Handle deleting a user
  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  // Handle updating a user
  const handleUpdate = (userId: number) => {
    const updatedData = { role: 'admin' }; // Example of updating role, modify as necessary
    dispatch(updateUser({ userId, userData: updatedData }));
  };

  // Handle viewing the details of a user
  const handleViewUser = (userId: string) => {
    navigate(`/user-details/${userId}`);
  };

  if (loading) {
    return <div className="text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">User List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Sr. No.</th>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Full Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-b">
                <td className="py-2 px-4">{index + 1}</td> {/* Sr. No. */}
                <td className="py-2 px-4">
                  <div className="w-16 h-16 overflow-hidden rounded-full">
                    <img
                      src={user.image || '/path/to/default-image.jpg'} // Show default image if no user image
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td> {/* User Image */}
                <td className="py-2 px-4">{user.fullName}</td> {/* Full Name */}
                <td className="py-2 px-4">{user.email}</td> {/* Email */}
                <td className="py-2 px-4">{user.role}</td> {/* Role */}
                <td className="py-2 px-4">
                  <Button onClick={() => handleViewUser(user.id)} className="mr-2">
                    <FaEye /> {/* View Icon */}
                  </Button>
                  <Button onClick={() => handleUpdate(user.id)} className="mr-2">
                    <FaPen /> {/* Edit Icon */}
                  </Button>
                  <Button onClick={() => handleDelete(user.id)} className="mr-2">
                    <FaTrash /> {/* Delete Icon */}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
