import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrders,
  deleteOrder,
  updateOrderStatus,
} from '../../app/reducer/orderSlice'; // Assuming these actions exist
import { FaTrash, FaEye } from 'react-icons/fa'; // For icons (delete, edit, view)
import Button from '../../components/ui/button/Button'; // Assuming you have a Button component
import { useNavigate } from 'react-router-dom'; // For navigating to Order Detail page

const OrderList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get orders, status, and error from the Redux store
  const orders = useSelector((state: any) => state.order.orders);
  const status = useSelector((state: any) => state.order.status);
  const error = useSelector((state: any) => state.order.error);

  // Fetch orders on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrders());
    }
  }, [dispatch, status]);

  // Handle deleting an order
  const handleDelete = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      dispatch(deleteOrder(orderId));
    }
  };

  // Handle updating the status of an order
  const handleUpdateStatus = (orderId: string, status: string) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  // Handle viewing the details of an order
  const handleViewOrder = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
  };

  if (status === 'loading') {
    return <div className="text-center">Loading orders...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Order List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Sr. No.</th>
              <th className="py-2 px-4 text-left">Product</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">User Name</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.orderId} className="border-b">
                <td className="py-2 px-4">{index + 1}</td> {/* Sr. No. */}
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 overflow-hidden rounded-md">
                      <img
                        src={`http://localhost:8000/storage/${order.cart[0]?.images}`} // Assuming the first item in the cart is the product image
                        alt={order.cart[0]?.name || "Product Image"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{order.cart[0]?.name}</span> {/* Product Name */}
                  </div>
                </td>
                <td className="py-2 px-4">{order.cart[0]?.category?.category_name || 'N/A'}</td> {/* Category */}
                <td className="py-2 px-4">{order.orderId}</td> {/* Order ID */}
                <td className="py-2 px-4">{order.userDetails.name}</td> {/* User Name */}
                <td className="py-2 px-4">{order.grandTotal}</td> {/* Price */}
                <td className="py-2 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-2 px-4">
                  <Button onClick={() => handleViewOrder(order.orderId)} className="mr-2">
                    <FaEye /> {/* View Icon */}
                  </Button>
                  <Button onClick={() => handleDelete(order.orderId)} className="mr-2">
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

export default OrderList;
