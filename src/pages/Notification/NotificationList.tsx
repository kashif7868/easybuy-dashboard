import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts, deleteContact } from "../../app/reducer/contactSlice";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table"; // Assuming these are your custom UI components

const NotificationList = () => {
  const dispatch = useDispatch();
  const { contacts, loading, error } = useSelector((state: any) => state.contacts);

  useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);

  const handleDelete = (contactId: number) => {
    dispatch(deleteContact(contactId));
  };

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (contacts.length === 0) {
    return <p>No notifications available</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Notifications</h2>
      <Table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <TableHeader>
          <TableRow>
            <TableCell className="px-6 py-3 text-left font-medium text-gray-500">User</TableCell>
            <TableCell className="px-6 py-3 text-left font-medium text-gray-500">Message</TableCell>
            <TableCell className="px-6 py-3 text-center font-medium text-gray-500">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="border-b">
              <TableCell className="px-6 py-4">
                <div className="flex items-center">
                  <FaUserCircle size={40} className="text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">{contact.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-gray-600">{contact.message}</TableCell>
              <TableCell className="px-6 py-4 text-center">
                <Link
                  to={`/notification-detail/${contact.id}`}
                  className="text-blue-500 hover:text-blue-700 mr-4"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotificationList;
