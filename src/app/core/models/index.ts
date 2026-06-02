export enum UserRole { Admin = 'Admin', Seller = 'Seller', Customer = 'Customer' }
export enum OrderStatus {
  Pending = 'Pending', Confirmed = 'Confirmed', Shipped = 'Shipped',
  OutForDelivery = 'OutForDelivery', Delivered = 'Delivered',
  Cancelled = 'Cancelled', Returned = 'Returned'
}
export enum PaymentMethod { CashOnDelivery = 'CashOnDelivery', RazorPay = 'RazorPay', Card = 'Card', UPI = 'UPI' }

export interface ApiResponse<T> { success: boolean; message: string; data: T; }
export interface PagedResult<T> { items: T[]; totalCount: number; page: number; pageSize: number; totalPages: number; }

export interface AuthResponse {
  accessToken: string; refreshToken: string;
  email: string; fullName: string; role: UserRole; userId: number;
}

export interface Product {
  id: number; name: string; slug: string; description: string; brand: string;
  originalPrice: number; discountedPrice: number; discountPercent: number;
  stock: number; isActive: boolean; isFeatured: boolean; thumbnailUrl: string;
  averageRating: number; totalReviews: number;
  categoryId: number; categoryName: string;
  sellerId: number; sellerName: string;
  images: ProductImage[]; specifications: ProductSpec[];
}

export interface ProductList {
  id: number; name: string; slug: string; brand: string;
  originalPrice: number; discountedPrice: number; discountPercent: number;
  stock: number; thumbnailUrl: string; averageRating: number;
  totalReviews: number; categoryId: number; categoryName: string;
}

export interface ProductImage { id: number; imageUrl: string; isPrimary: boolean; sortOrder: number; }
export interface ProductSpec { key: string; value: string; }

export interface Category {
  id: number; name: string; slug: string; description: string;
  imageUrl: string; parentCategoryId: number; parentName: string;
  subCategories: Category[];
}

export interface CartItem {
  id: number; productId: number; productName: string; thumbnailUrl: string;
  brand: string; originalPrice: number; discountedPrice: number;
  discountPercent: number; quantity: number; stock: number; itemTotal: number;
}

export interface CartSummary {
  items: CartItem[]; subTotal: number; discount: number;
  shippingCharge: number; total: number; totalItems: number;
}

export interface Address {
  id: number; fullName: string; phoneNumber: string;
  addressLine1: string; addressLine2: string; city: string;
  state: string; pinCode: string; country: string;
  addressType: string; isDefault: boolean;
}

export interface Order {
  id: number; orderNumber: string; status: OrderStatus;
  subTotal: number; shippingCharge: number; discount: number; totalAmount: number;
  couponCode: string; trackingNumber: string; expectedDelivery: string;
  shippingAddress: Address; items: OrderItem[];
  payment: PaymentInfo; createdAt: string;
}

export interface OrderItem {
  id: number; productId: number; productName: string; productImageUrl: string;
  quantity: number; unitPrice: number; totalPrice: number;
}

export interface PaymentInfo {
  id: number; amount: number; status: string; method: string;
  transactionId: string; paidAt: string;
}

export interface Review {
  id: number; userId: number; userName: string; productId: number;
  rating: number; title: string; comment: string;
  status: string; createdAt: string; images: string[];
}

export interface DashboardStats {
  totalProducts: number; totalOrders: number; totalCustomers: number;
  totalRevenue: number; pendingOrders: number; lowStockProducts: number;
  revenueChart: { month: string; revenue: number; orders: number }[];
  orderStatusChart: { status: string; count: number }[];
}

export interface ProductFilter {
  search?: string; categoryId?: number; brand?: string;
  minPrice?: number; maxPrice?: number; minRating?: number;
  inStock?: boolean; sortBy?: string; page?: number; pageSize?: number;
}