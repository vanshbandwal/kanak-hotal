import { ToastType } from './ToastContext';

export const FASHION_TOASTS = {
    success: {
        add_to_edit: "Added to your edit",
        order_placed: "Order placed successfully",
        wishlist: "Saved to your wishlist",
        curation: "Curation updated"
    },
    error: {
        sold_out: "This piece just sold out",
        out_of_stock: "Inventory unavailable",
        payment: "Secure payment failed",
        denied: "Access denied"
    },
    info: {
        new_collection: "New collection dropped",
        on_the_way: "Your order is on the way",
        runway: "Runway update available",
        trends: "Seasonal trends identified"
    },
    warning: {
        low_stock: "Only 2 left in stock",
        sale_ending: "Final call - sale ends in 1 hour",
        limited: "Limited edition alert",
        last_chance: "Your last chance to shop"
    }
};

export const TOAST_ICONS: Record<ToastType, string> = {
    success: '✨', // Premium Sparkle
    error: '✖',   // Sharp minimalist cross
    info: '◆',    // Diamond/Abstract fashion mark
    warning: '⏳' // Hourglass for urgency
};
