import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import UsersCard from "../../components/ecommerce/UsersCard";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="EasyBuy Ecommerce Dashboard"
        description="E-commerce dashboard for EasyBuy platform with insights into sales, products, orders, and customer behavior."
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Metric Items in One Row */}
        <div className="col-span-12 ">
          <EcommerceMetrics />
        </div>

        {/* Monthly Sales Chart (Full Width) */}
        <div className="col-span-12">
          <MonthlySalesChart />
        </div>

        {/* Users Card (Same as before) */}
        <div className="col-span-12 xl:col-span-5">
          <UsersCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
