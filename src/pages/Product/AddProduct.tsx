import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../app/reducer/categorySlice';
import { fetchSubCategories } from '../../app/reducer/subCategorySlice';
import { fetchSmallCategories } from '../../app/reducer/smallCategorySlice';
import { createProduct } from '../../app/reducer/productSlice'; // Assuming createProduct action exists
import { useNavigate } from 'react-router-dom'; // For navigation after adding a product
import Button from '../../components/ui/button/Button'; // Assuming you have a Button component

const AddProduct: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // States for form inputs
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        discount_price: '',
        discount_percentage: '',
        rating: '',
        reviews: '',
        description: '',
        color: '',
        brand: '',
        meter: '',
        size: '',
        items_stock: '',
        category_id: '',
        subcategory_id: '',
        small_category_id: '',
        featured: false,
        deal_of_the_day: false,
        best_seller: false,
        top_offer_product: false,
    });

    const [productImage, setProductImage] = useState<File | null>(null);
    const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
    const [additionalImages, setAdditionalImages] = useState<FileList | null>(null);
    const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Fetch categories, subcategories, and small categories from the store
    const categories = useSelector((state: any) => state.category.categories || []);
    const subcategories = useSelector((state: any) => state.subCategory.subcategories || []);
    const smallCategories = useSelector((state: any) => state.smallCategory.smallCategories || []);

    // Filter subcategories based on selected category
    const filteredSubcategories = subcategories.filter(
        (subCategory) => subCategory.category_id === Number(productData.category_id)
    );

    // Filter small categories based on selected subcategory
    const filteredSmallCategories = smallCategories.filter(
        (smallCategory) => smallCategory.subcategory_id === Number(productData.subcategory_id)
    );
    // Fetch data when component loads
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchSubCategories());
        dispatch(fetchSmallCategories());
    }, [dispatch]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>) => {
        const { name, value, type, checked } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle file selection for product image
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProductImage(e.target.files[0]);
            setProductImagePreview(URL.createObjectURL(e.target.files[0])); // Set the preview
        }
    };

    // Handle file selection for additional images
    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAdditionalImages(e.target.files);
            const previews = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
            setAdditionalImagesPreviews((prevPreviews) => [...prevPreviews, ...previews]); // Add previews for additional images
        }
    };

    // Handle removal of additional images
    const handleRemoveImage = (index: number) => {
        const updatedPreviews = [...additionalImagesPreviews];
        updatedPreviews.splice(index, 1);
        setAdditionalImagesPreviews(updatedPreviews);

        const updatedImages = [...(additionalImages ? Array.from(additionalImages) : [])];
        updatedImages.splice(index, 1);
        setAdditionalImages(updatedImages as FileList);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productData.name || !productData.price || !productImage) {
            setError('Please fill in all required fields and upload an image.');
            return;
        }

        setIsLoading(true);
        setError(null);

        // Prepare the form data for product creation
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('price', productData.price);
        formData.append('discount_price', productData.discount_price);
        formData.append('discount_percentage', productData.discount_percentage);
        formData.append('rating', productData.rating);
        formData.append('reviews', productData.reviews);
        formData.append('description', productData.description);
        formData.append('color', productData.color);
        formData.append('brand', productData.brand);
        formData.append('meter', productData.meter);
        formData.append('size', productData.size);
        formData.append('items_stock', productData.items_stock);
        formData.append('category_id', productData.category_id);
        formData.append('subcategory_id', productData.subcategory_id);
        formData.append('small_category_id', productData.small_category_id);
        formData.append('featured', String(productData.featured));
        formData.append('deal_of_the_day', String(productData.deal_of_the_day));
        formData.append('best_seller', String(productData.best_seller));
        formData.append('top_offer_product', String(productData.top_offer_product));

        if (productImage) formData.append('images', productImage);

        if (additionalImages) {
            Array.from(additionalImages).forEach((image) => {
                formData.append('additional_images', image);
            });
        }

        try {
            // Dispatch action to create product
            await dispatch(createProduct(formData));

            // Navigate to product list or other page
            navigate('/product-list');
        } catch (err) {
            setError('Error creating product. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Left Side: Product Details */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-gray-800">Add New Product</h3>
                    <h4 className="text-lg font-medium text-gray-600">Basic Information</h4>
                    <p className="text-gray-500 text-sm">Section to configure basic product information</p>

                    {/* Display error message */}
                    {error && (
                        <div className="bg-red-100 text-red-800 p-4 mb-4 rounded-md">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Category Dropdown */}
                        <div>
                            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                id="category_id"
                                name="category_id"
                                value={productData.category_id}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories && categories.map((category: { id: number; category_name: string }) => (
                                    <option key={category.id} value={category.id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700">Subcategory</label>
                            <select
                                id="subcategory_id"
                                name="subcategory_id"
                                value={productData.subcategory_id}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Subcategory</option>
                                {filteredSubcategories.length > 0 ? (
                                    filteredSubcategories.map((subcategory: { id: number; subCategoryName: string }) => (
                                        <option key={subcategory.id} value={subcategory.id}>
                                            {subcategory.subCategoryName}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No subcategories available</option>
                                )}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="small_category_id" className="block text-sm font-medium text-gray-700">Small Category</label>
                            <select
                                id="small_category_id"
                                name="small_category_id"
                                value={productData.small_category_id}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Small Category</option>
                                {filteredSmallCategories.length > 0 ? (
                                    filteredSmallCategories.map((smallCategory: { id: number; small_category_name: string }) => (
                                        <option key={smallCategory.id} value={smallCategory.id}>
                                            {smallCategory.small_category_name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No small categories available</option>
                                )}
                            </select>
                        </div>


                        {/* Product Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={productData.name}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Product Name"
                                required
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={productData.price}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Price"
                                required
                            />
                        </div>

                        {/* Discount Price */}
                        <div>
                            <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700">Discount Price</label>
                            <input
                                type="number"
                                id="discount_price"
                                name="discount_price"
                                value={productData.discount_price}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Discount Price"
                            />
                        </div>

                        {/* Discount Percentage */}
                        <div>
                            <label htmlFor="discount_percentage" className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                            <input
                                type="number"
                                id="discount_percentage"
                                name="discount_percentage"
                                value={productData.discount_percentage}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Discount Percentage"
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                            <input
                                type="number"
                                id="rating"
                                name="rating"
                                value={productData.rating}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Rating"
                            />
                        </div>

                        {/* Reviews */}
                        <div>
                            <label htmlFor="reviews" className="block text-sm font-medium text-gray-700">Reviews</label>
                            <input
                                type="number"
                                id="reviews"
                                name="reviews"
                                value={productData.reviews}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Reviews"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={productData.description}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Description"
                            />
                        </div>

                        {/* Color */}
                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
                            <input
                                type="text"
                                id="color"
                                name="color"
                                value={productData.color}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Color"
                            />
                        </div>

                        {/* Brand */}
                        <div>
                            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                            <input
                                type="text"
                                id="brand"
                                name="brand"
                                value={productData.brand}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Brand"
                            />
                        </div>

                        {/* Meter */}
                        <div>
                            <label htmlFor="meter" className="block text-sm font-medium text-gray-700">Meter</label>
                            <input
                                type="text"
                                id="meter"
                                name="meter"
                                value={productData.meter}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Meter"
                            />
                        </div>

                        {/* Size */}
                        <div>
                            <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size</label>
                            <input
                                type="text"
                                id="size"
                                name="size"
                                value={productData.size}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Size"
                            />
                        </div>

                        {/* Items in Stock */}
                        <div>
                            <label htmlFor="items_stock" className="block text-sm font-medium text-gray-700">Items in Stock</label>
                            <input
                                type="number"
                                id="items_stock"
                                name="items_stock"
                                value={productData.items_stock}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Items in Stock"
                            />
                        </div>

                        {/* Featured, Deal of the Day, etc. */}
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={productData.featured}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                Featured Product
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="deal_of_the_day"
                                    checked={productData.deal_of_the_day}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                Deal of the Day
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="best_seller"
                                    checked={productData.best_seller}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                Best Seller
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="top_offer_product"
                                    checked={productData.top_offer_product}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                Top Offer Product
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? 'Creating Product...' : 'Create Product'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Right Side: Product Image */}
                <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-600">Product Image</h4>
                    <p className="text-gray-500 text-sm">Add or change image for the product</p>

                    {/* Product Image Preview */}
                    {productImagePreview && (
                        <div className="mb-4">
                            <img src={productImagePreview} alt="Product Preview" className="w-32 h-32 object-cover" />
                        </div>
                    )}

                    <div className="flex justify-center items-center border-2 border-dashed border-gray-300 p-4 rounded-lg">

                        <input
                            type="file"
                            name="productImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="productImage"
                            required
                        />
                        <label
                            htmlFor="productImage"
                            className="cursor-pointer text-gray-700 hover:text-blue-500"
                        >

                            <div className="text-center">
                                <div className="mb-4">
                                    <span className="text-xl">&#128247;</span>
                                </div>
                                <p className="text-sm text-gray-600">Drop your image here, or browse</p>
                                <p className="text-xs text-gray-400">Support: jpeg, png</p>
                            </div>
                        </label>
                    </div>

                    {/* Additional Images Preview */}
                    <h4 className="text-lg font-medium text-gray-600 mt-6">Additional Images</h4>
                    {additionalImagesPreviews.length > 0 && (
                        <div className="flex gap-4">
                            {additionalImagesPreviews.map((preview, index) => (
                                <div key={index} className="relative w-20 h-20">
                                    <img src={preview} alt={`Additional Image ${index + 1}`} className="object-cover w-full h-full" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-sm"
                                    >
                                        &#10005;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-4">
                        <input
                            type="file"
                            name="additional_images"
                            accept="image/*"
                            onChange={handleAdditionalImagesChange}
                            multiple
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
