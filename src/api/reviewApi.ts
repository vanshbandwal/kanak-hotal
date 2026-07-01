import client from './client';
import endpoints from './endpoint';

export interface Review {
    _id: string;
    rating: number;
    comment: string;
    reply: string | null;
    isApproved: boolean;
    createdAt: string;
    customer: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    product: {
        _id: string;
        name: string;
        mainImage?: string;
    };
}

export interface ReviewsResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    totalPages: number;
    data: Review[];
}

export const reviewApi = {
    getAllReviews: async (page = 1, limit = 50): Promise<ReviewsResponse> => {
        const response = await client.get(`${endpoints.review.ALL}?page=${page}&limit=${limit}`);
        return response.data;
    },

    getReviewStats: async () => {
        const response = await client.get(endpoints.review.STATS);
        return response.data;
    },

    replyToReview: async (id: string, reply: string) => {
        const response = await client.put(endpoints.review.REPLY(id), { reply });
        return response.data;
    },

    deleteReview: async (id: string) => {
        const response = await client.delete(endpoints.review.DELETE(id));
        return response.data;
    }
};
