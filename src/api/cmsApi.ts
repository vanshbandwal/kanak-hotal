import client from './client';
import { CMS_ENDPOINTS } from './endpoint';

export const cmsApi = {
    // CMS Pages (Terms, Privacy, About, Contact)
    getCmsPage: async (pageKey: string) => {
        return await client.get(CMS_ENDPOINTS.PAGE.GET(pageKey));
    },

    updateCmsPage: async (pageKey: string, data: { title: string, content: string, isActive?: boolean }) => {
        return await client.put(CMS_ENDPOINTS.PAGE.UPDATE(pageKey), data);
    },

    // FAQs
    getAllFaqs: async () => {
        return await client.get(CMS_ENDPOINTS.FAQ.ALL);
    },

    createFaq: async (data: { question: string, answer: string, order?: number, isActive?: boolean }) => {
        return await client.post(CMS_ENDPOINTS.FAQ.CREATE, data);
    },

    updateFaq: async (id: string, data: any) => {
        return await client.put(CMS_ENDPOINTS.FAQ.UPDATE(id), data);
    },

    deleteFaq: async (id: string) => {
        return await client.delete(CMS_ENDPOINTS.FAQ.DELETE(id));
    }
};

export default cmsApi;
