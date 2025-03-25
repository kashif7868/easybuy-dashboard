import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProducts,
    deleteProduct,
    selectProducts,
    selectProductStatus,
    selectProductError
} from '../../app/reducer/productSlice';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/button/Button'; // Corrected Button import
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoAddCircle } from 'react-icons/io5';
import { utils, writeFile } from 'xlsx';

const ProductList: React.FC = () => {
    const dispatch = useDispatch<any>();
    const products = useSelector(selectProducts);
    const loading = useSelector(selectProductStatus);
    const error = useSelector(selectProductError);
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    const handleExport = () => {
        const data = products.map((product) => ({
            ID: product.id,
            Name: product.name,
            Price: `$${product.price}`,
            Discount_Price: `$${product.discount_price}`,
            Discount_Percentage: `${product.discount_percentage}%`,
            Rating: product.rating,
            Reviews: product.reviews,
            Description: product.description,
            Color: product.color,
            Brand: product.brand,
            Meter: product.meter,
            Size: product.size,
            Stock: product.items_stock,
            Category: product.category.category_name,
            Subcategory: product.subcategory.subCategoryName,
            Small_Category: product.small_category.small_category_name,
            Created_At: product.created_at,
            Updated_At: product.updated_at
        }));
        const worksheet = utils.json_to_sheet(data);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Products");
        writeFile(workbook, "Products.xlsx");
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Products</h1>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search product"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded-md"
                    />
                    <Button
                        className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-1"
                        onClick={handleExport}
                    >
                        Export
                    </Button>
                    <Button
                        className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-1"
                        onClick={() => navigate('/add-product')}
                    >
                        <IoAddCircle size={18} /> Add Product
                    </Button>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="flex items-center gap-2">
                                <img
                                    src={`http://localhost:8000/storage/${product.images}`}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded-md"
                                />
                                {product.name}
                            </TableCell>
                            <TableCell>{product.category.category_name}</TableCell>
                            <TableCell>{product.items_stock}</TableCell>
                            <TableCell className="text-green-500 font-semibold">In Stock</TableCell>
                            <TableCell>${product.price}</TableCell>
                            <TableCell className="flex gap-2">
                                <FaEdit
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => navigate(`/edit-product/${product.id}`)}
                                />
                                <FaTrash
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => handleDelete(product.id)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ProductList;
