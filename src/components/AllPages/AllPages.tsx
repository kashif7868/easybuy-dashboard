import { Route, Routes } from "react-router-dom";
import UserProfiles from "../../pages/UserProfiles";
import LineChart from "../../pages/Charts/LineChart";
import BarChart from "../../pages/Charts/BarChart";
import Blank from "../../pages/Blank";
import Home from "../../pages/Dashboard/Home";
import SliderList from "../../pages/Slider/SliderList";
import AddSlider from "../../pages/Slider/AddSlider";
import DetailsSilder from "../../pages/Slider/DetailsSlider";
import UpdateSlider from "../../pages/Slider/UpdateSlider";
import BannerList from "../../pages/Banner/BannerList";
import AddBanner from "../../pages/Banner/AddBanner";
import AddCategory from "../../pages/Category/AddCategory";
import CategoryList from "../../pages/Category/CategoryList";
import NotFound from "../../pages/OtherPage/NotFound";
import SubCategoryList from "../../pages/SubCategory/SubCategoryList";
import AddSubCategory from "../../pages/SubCategory/AddSubCategory";
import SmallListCategory from "../../pages/SmallCategory/SmallListCategory";
import AddSmallCategory from "../../pages/SmallCategory/AddSmallCategory";
import ProductList from "../../pages/Product/ProductList";
import AddProduct from "../../pages/Product/AddProduct";
import BasicTableOne from "../tables/BasicTables/BasicTableOne";
import OrderList from "../../pages/Order/OrderList";
import OrderDetails from "../../pages/Order/OrderDetails";
import UserList from "../../pages/AuthPages/UserList";
const AllPages = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* slider */}
        <Route path="/slider-list" element={<SliderList />} />
        <Route path="/add-slider" element={<AddSlider />} />
        <Route path="/slider-details/:id" element={< DetailsSilder />} />
        <Route path="/slider-edit/:id" element={<UpdateSlider />} /> 
        {/* banner */}
        <Route path="/banner-list" element={<BannerList />} />
        <Route path="/add-banner" element={<AddBanner />} />
        {/* Category */}
        <Route path="/category-list" element={<CategoryList />} />
        <Route path="/add-category" element={<AddCategory />} />
        {/* sab category */}
        <Route path="/add-sub-category" element={<AddSubCategory />} />
        <Route path="/sub-category-list" element={<SubCategoryList />} />
        {/* small category */}
        <Route path="/small-category-list" element={<SmallListCategory />} />
        <Route path="/add-small-category" element={<AddSmallCategory />} />
        {/* product */}
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/product-list" element={<ProductList />} />
        {/* order */}
        <Route path="/order-list" element={<OrderList />} />
        <Route path="/order-details/:orderId" element={<OrderDetails />} />
        {/* user */}

        <Route path="/users" element={<UserList />} />
        {/* basic table */}
        <Route path="/basic-tables" element={<BasicTableOne />} />

        {/* profile */}
        <Route path="/profile" element={<UserProfiles />} />
        <Route path="/blank" element={<Blank />} />
        <Route path="/line-chart" element={<LineChart />} />
        <Route path="/bar-chart" element={<BarChart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AllPages;
