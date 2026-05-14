import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

/// Layouts
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import FashionLoader from '../components/Common/FashionLoader';

/// Screens Lazy Loaded
const LoginScreen = lazy(() => import('../features/Auth/screens/LoginScreen'));
const ForgotPasswordScreen = lazy(() => import('../features/Auth/screens/ForgotPasswordScreen'));
const ResetPasswordScreen = lazy(() => import('../features/Auth/screens/ResetPasswordScreen'));
const DashboardScreen = lazy(() => import('../features/Dashboard/screens/DashboardScreen'));
const LandingScreen = lazy(() => import('../features/Landing/screens/LandingScreen'));
const ProductsScreen = lazy(() => import('../features/Products/screens/ProductsScreen'));
const OrdersScreen = lazy(() => import('../features/Orders/screens/OrdersScreen'));
const CustomersScreen = lazy(() => import('../features/Customers/screens/CustomersScreen'));
const CMSScreen = lazy(() => import('../features/CMS/screens/CMSScreen'));
const CouponsScreen = lazy(() => import('../features/Coupons/screens/CouponsScreen'));
const BannersScreen = lazy(() => import('../features/Banners/screens/BannersScreen'));
const ReviewsScreen = lazy(() => import('../features/Reviews/screens/ReviewsScreen'));
const QueriesScreen = lazy(() => import('../features/Queries/screens/QueriesScreen'));
const ServicePartnersScreen = lazy(() => import('../features/ServicePartners/screens/ServicePartnersScreen'));
const ReportsScreen = lazy(() => import('../features/Reports/screens/ReportsScreen'));
const AddRoleScreen = lazy(() => import('../features/Roles/screens/AddRoleScreen'));
const EditRoleScreen = lazy(() => import('../features/Roles/screens/EditRoleScreen'));
const RoleListScreen = lazy(() => import('../features/Roles/screens/RoleListScreen'));
const AddStaffScreen = lazy(() => import('../features/Roles/screens/AddStaffScreen'));
const StaffListScreen = lazy(() => import('../features/Roles/screens/StaffListScreen'));

import { useAppDispatch, useAppSelector } from '../store';
import { sidebarApi } from '../api/sidebarApi';
import { setSidebarItems } from '../store/slices/authSlice';

const Markup = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    React.useEffect(() => {
        const fetchInitialData = async () => {
            if (isAuthenticated) {
                const { data, error } = await sidebarApi.getSidebarMenu();
                if (!error && data) {
                    dispatch(setSidebarItems(data));
                } else {
                    // 🛑 Fix: Even if sidebar fails, don't hang the app
                    dispatch(setSidebarItems([])); 
                    console.error("Failed to fetch sidebar:", error);
                }

            }
        };
        fetchInitialData();
    }, [isAuthenticated, dispatch]);

    const authRoutes = [
        { url: "login", component: isAuthenticated ? <Navigate to="/" replace /> : <LoginScreen /> },
        { url: "forgot-password", component: <ForgotPasswordScreen /> },
        { url: "reset-password", component: <ResetPasswordScreen /> },
    ];

    const mainRoutes = [
        { url: "/", component: <LandingScreen /> },
        { url: "dashboard", component: <DashboardScreen /> },
        { url: "products", component: <ProductsScreen /> },
        { url: "orders", component: <OrdersScreen /> },
        { url: "customers", component: <CustomersScreen /> },
        { url: "service-partners", component: <ServicePartnersScreen /> },
        { url: "cms", component: <CMSScreen /> },
        { url: "coupons", component: <CouponsScreen /> },
        { url: "banners", component: <BannersScreen /> },
        { url: "reviews", component: <ReviewsScreen /> },
        { url: "queries", component: <QueriesScreen /> },
        { url: "reports", component: <ReportsScreen /> },
        { url: "roles/add", component: <AddRoleScreen /> },
        { url: "roles/edit/:id", component: <EditRoleScreen /> },
        { url: "roles/list", component: <RoleListScreen /> },
        { url: "roles/add-staff", component: <AddStaffScreen /> },
        { url: "roles/staff", component: <StaffListScreen /> },
    ];

    return (
        <Suspense fallback={<FashionLoader fullScreen />}>
            <Routes>
                {/* Auth Routes */}
                {authRoutes.map((route, i) => (
                    <Route
                        key={`auth-${i}`}
                        path={route.url}
                        element={route.component}
                    />
                ))}

                {/* Main Application Routes (Protected) */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        {mainRoutes.map((route, i) => (
                            <Route
                                key={`main-${i}`}
                                path={route.url}
                                element={route.component}
                            />
                        ))}
                    </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
            </Routes>
        </Suspense>
    );
};

export default Markup;
