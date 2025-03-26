import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { fetchMetrics } from "../../app/reducer/orderSlice"; // Import the fetchMetrics action

export default function EcommerceMetrics() {
  const dispatch = useDispatch();
  const { metrics, status } = useSelector((state: any) => state.order); // Access metrics from the state

  // Fetch metrics data when the component mounts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMetrics());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  if (status === "failed" || !metrics) {
    return <div>Error loading metrics</div>; // Show error if fetch failed
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 md:gap-6">
      {/* Metric Item Start (Customers) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 min-w-[250px]">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.customersCount}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start (Orders) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 min-w-[250px]">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.ordersCount}
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start (Total Sales in PKR) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 min-w-[250px]">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Sales (PKR)
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              ₨ {metrics.totalSales}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            7.23%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}
    </div>
  );
}
