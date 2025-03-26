import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const NotificationDetail = () => {
  const { id } = useParams();
  const { contacts } = useSelector((state: any) => state.contacts);
  const contact = contacts.find((contact) => contact.id === parseInt(id));

  if (!contact) {
    return <p className="text-center text-xl font-semibold text-gray-600">Notification not found</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Notification Details</h2>
        <div className="space-y-4">
          <div>
            <p className="text-xl font-medium text-gray-700">
              <span className="font-semibold">Name: </span>{contact.name}
            </p>
          </div>
          <div>
            <p className="text-xl font-medium text-gray-700">
              <span className="font-semibold">Email: </span>{contact.email}
            </p>
          </div>
          <div>
            <p className="text-xl font-medium text-gray-700">
              <span className="font-semibold">Message: </span>{contact.message}
            </p>
          </div>
          <div>
            <p className="text-xl font-medium text-gray-700">
              <span className="font-semibold">Created At: </span>
              {new Date(contact.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xl font-medium text-gray-700">
              <span className="font-semibold">Updated At: </span>
              {new Date(contact.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;
