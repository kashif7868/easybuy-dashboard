import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../app/reducer/productSlice';
import { fetchCategories, selectCategories } from '../../app/reducer/categorySlice';
import { fetchSubCategories, selectSubCategories } from '../../app/reducer/subCategorySlice';
import { fetchSmallCategories, selectSmallCategories } from '../../app/reducer/smallCategorySlice';
import { FaImage, FaTimesCircle } from 'react-icons/fa';
import Button from '../../components/ui/button/Button';

const AddProduct: React.FC = () => {
    const dispatch = useDispatch<any>();
    const categories = useSelector(selectCategories);
    const subcategories = useSelector(selectSubCategories);
    const smallCategories = useSelector(selectSmallCategories);
    const error = useSelector((state: any) => state.product.error); // Get error from Redux store

    // State to manage form data and success message
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discount_price: '',
        discount_percentage: '',
        rating: '',
        reviews: '',
        color: '',
        brand: '',
        meter: '',
        size: '',
        items_stock: '',
        category_id: '', // Use category_id instead of category_name
        subcategory_id: '', // Use subcategory_id instead of subcategory_name
        small_category_id: '', // Use small_category_id instead of small_category_name
        images: null, // Main image (single file)
        additional_images: [], // Multiple additional images
        featured: false,
        deal_of_the_day: false,
        best_seller: false,
        top_offer_product: false
    });
    const [successMessage, setSuccessMessage] = useState(''); // Success message state

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchSubCategories());
        dispatch(fetchSmallCategories());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };

        // Calculate discount percentage when price or discount_price changes
        if (name === 'price' || name === 'discount_price') {
            const price = parseFloat(updatedFormData.price);
            const discountPrice = parseFloat(updatedFormData.discount_price);

            if (!isNaN(price) && !isNaN(discountPrice) && price > 0) {
                const discountPercentage = ((price - discountPrice) / price) * 100;
                updatedFormData.discount_percentage = discountPercentage.toFixed(2);
            } else {
                updatedFormData.discount_percentage = '';
            }
        }

        setFormData(updatedFormData);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, images: e.target.files[0] });
        }
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, images: null });
    };

    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData({
                ...formData,
                additional_images: [...formData.additional_images, ...Array.from(e.target.files)]
            });
        }
    };

    const handleRemoveAdditionalImage = (index: number) => {
        const updatedImages = [...formData.additional_images];
        updatedImages.splice(index, 1);
        setFormData({ ...formData, additional_images: updatedImages });
    };

    const validateForm = () => {
        // Validate form to ensure all required fields are filled
        if (
            !formData.name ||
            !formData.price ||
            !formData.discount_price ||
            !formData.rating ||
            !formData.category_id || // Ensure category_id is selected
            !formData.subcategory_id || // Ensure subcategory_id is selected
            !formData.small_category_id || // Ensure small_category_id is selected
            !formData.images // Main image must be provided (changed from image to images)
        ) {
            return false;
        }

        // Validate rating is a number between 1 and 5
        if (isNaN(parseFloat(formData.rating)) || parseFloat(formData.rating) < 1 || parseFloat(formData.rating) > 5) {
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            alert("Please fill in all required fields, and ensure rating is between 1 and 5.");
            return;
        }

        const productData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value && key !== 'additional_images') {
                productData.append(key, value as string);
            }
        });

        // Add main image to FormData (required, now using 'images' as the field name)
        if (formData.images) {
            productData.append('images', formData.images);
        }

        // Add additional images to FormData (multiple)
        if (formData.additional_images.length) {
            formData.additional_images.forEach((img, index) => {
                productData.append(`additional_images[${index}]`, img);
            });
        }

        try {
            await dispatch(createProduct(productData)).unwrap();
            setSuccessMessage('Product added successfully!'); // Show success message
        } catch (err) {
            console.error('Product creation failed', err);
        }
    };

    return (
        <div className="container mx-auto p-4 bg-white">
            <h1 className="text-2xl font-bold mb-4">Add New Product</h1>

            {/* Display error if exists */}
            {error && (
                <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">
                    {/* Display error messages */}
                    {typeof error === 'string' ? error : (error?.message || Object.values(error?.errors || {}).join(', '))}
                </div>
            )}

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-200 text-green-800 p-4 mb-4 rounded">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                {/* Left Side (Product Details) */}
                <div>
                    <h2 className="text-lg font-semibold">Basic Information</h2>
                    {['name', 'description', 'price', 'discount_price', 'discount_percentage', 'rating', 'reviews', 'color', 'brand', 'meter', 'size', 'items_stock'].map((field) => (
                        <div key={field} className="mb-4">
                            <label className="block mb-2 capitalize">{field.replace('_', ' ')}</label>
                            <input
                                type="text"
                                name={field}
                                value={(formData as any)[field]}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                            />
                        </div>
                    ))}

                    <label className="block mb-2">Category</label>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md mb-4"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                        ))}
                    </select>

                    <label className="block mb-2">Subcategory</label>
                    <select
                        name="subcategory_id"
                        value={formData.subcategory_id}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md mb-4"
                    >
                        <option value="">Select Subcategory</option>
                        {subcategories.map((sub) => (
                            <option key={sub.id} value={sub.id}>{sub.subCategoryName}</option>
                        ))}
                    </select>

                    <label className="block mb-2">Small Category</label>
                    <select
                        name="small_category_id"
                        value={formData.small_category_id}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md"
                    >
                        <option value="">Select Small Category</option>
                        {smallCategories.map((small) => (
                            <option key={small.id} value={small.id}>{small.small_category_name}</option>
                        ))}
                    </select>
                </div>

                {/* Right Side (Images and Special Features) */}
                <div>
                    {/* Product Image (Main Image) */}
                    <h2 className="text-lg font-semibold">Product Image</h2>
                    <p className="text-sm text-gray-500 mb-4">Add or change image for the product</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                        {formData.images ? (
                            <div className="relative">
                                <img src={URL.createObjectURL(formData.images)} alt="Uploaded Image" className="w-24 h-24 object-cover rounded-md" />
                                <FaTimesCircle
                                    className="absolute top-0 right-0 text-red-500 text-xl cursor-pointer"
                                    onClick={handleRemoveImage}
                                />
                            </div>
                        ) : (
                            <>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="imageUpload"
                                />
                                <label htmlFor="imageUpload" className="cursor-pointer text-blue-500 flex flex-col items-center gap-2">
                                    <FaImage className="w-12 h-12 text-gray-400" />
                                    Drop your image here, or <span className="font-bold">browse</span>
                                </label>
                            </>
                        )}
                        <p className="text-xs text-gray-400 mt-2">Support: jpeg, png</p>
                    </div>

                    {/* Additional Images */}
                    <label className="block mt-4">Additional Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png"
                        onChange={handleAdditionalImagesChange}
                        className="w-full border px-3 py-2 rounded-md"
                    />

                    {formData.additional_images.map((img, index) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                            <img src={URL.createObjectURL(img)} alt="Additional Image" className="w-16 h-16 object-cover rounded-md" />
                            <FaTimesCircle
                                className="text-red-500 text-xl cursor-pointer"
                                onClick={() => handleRemoveAdditionalImage(index)}
                            />
                        </div>
                    ))}

                    {/* Special Features */}
                    <div className="mt-4">
                        {['featured', 'deal_of_the_day', 'best_seller', 'top_offer_product'].map((option) => (
                            <div key={option} className="flex items-center gap-2 mb-2">
                                <input
                                    type="checkbox"
                                    name={option}
                                    checked={(formData as any)[option]}
                                    onChange={(e) => setFormData({ ...formData, [option]: e.target.checked })}
                                />
                                <label>{option.replace('_', ' ').toUpperCase()}</label>
                            </div>
                        ))}
                    </div>

                    {/* Save Button */}
                    <div className="col-span-2 flex justify-end mt-6">
                        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Product</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
