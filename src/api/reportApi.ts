import client from './client';
import endpoints from './endpoint';

interface DashboardOverviewParams {
    range?: 'today' | 'last_7_days' | 'last_30_days' | 'this_month' | 'this_year' | 'custom';
    startDate?: string;
    endDate?: string;
}

export interface ReportDataResponse {
    kpis: {
        totalCustomers: number;
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
        totalDiscount: number;
    };
    chart: any[];
    orderStatusBreakdown: any[];
    topProducts: any[];
    salesByCategory: any[];
}

export const reportApi = {
    getOverview: async (params?: DashboardOverviewParams): Promise<{ data: { success: boolean, data: ReportDataResponse } | null, error: string | null }> => {
        return await client.get(endpoints.report.OVERVIEW, { params });
    }
};

export default reportApi;
