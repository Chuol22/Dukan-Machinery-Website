// data-service.ts — Unified data access layer
import prisma from "@/lib/prisma";
import { machinesData, getMachineBySlug as getStaticMachineBySlug } from "@/data/machinesData";

// Unified Machine interface that works with both Prisma and static data
export interface UnifiedMachine {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  gallery?: string[];
  category: string;
  type: string;
  price: number | string;
  specifications?: Record<string, any>;
  input?: string;
  output?: string;
  process?: string;
  features?: string[];
  applications?: string[];
  isAvailable?: boolean;
  stockQuantity?: number;
}

// Unified Order interface
export interface UnifiedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: string;
  paymentStatus: string;
  total: number;
  items: UnifiedOrderItem[];
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
}

export interface UnifiedOrderItem {
  id: string;
  productName: string;
  productSku: string;
  quantity: number;
  price: number;
  total: number;
}

// Machine data service
export const machineService = {
  // Get machine by slug - tries Prisma first, falls back to static data
  async getBySlug(slug: string): Promise<UnifiedMachine | null> {
    try {
      // Try Prisma first
      const dbMachine = await prisma.machine.findUnique({
        where: { slug },
        include: { category: true },
      });

      if (dbMachine) {
        return {
          id: dbMachine.id,
          slug: dbMachine.slug,
          name: dbMachine.name,
          description: dbMachine.description,
          image: dbMachine.image,
          gallery: dbMachine.gallery,
          category: dbMachine.category.name,
          type: dbMachine.type,
          price: dbMachine.price,
          specifications: dbMachine.specifications as Record<string, any>,
          input: dbMachine.input,
          output: dbMachine.output,
          process: dbMachine.process,
          features: dbMachine.features,
          applications: dbMachine.applications,
          isAvailable: dbMachine.is_available,
          stockQuantity: dbMachine.stock_quantity,
        };
      }
    } catch (error) {
      console.error("Error fetching machine from database:", error);
    }

    // Fall back to static data
    const staticMachine = getStaticMachineBySlug(slug);
    if (staticMachine) {
      return {
        id: staticMachine.id.toString(),
        slug: staticMachine.slug,
        name: staticMachine.name,
        description: staticMachine.description,
        image: staticMachine.image,
        gallery: staticMachine.gallery,
        category: staticMachine.category,
        type: staticMachine.type,
        price: staticMachine.price,
        input: staticMachine.input,
        output: staticMachine.output,
        process: staticMachine.process,
        features: staticMachine.features,
        applications: staticMachine.applications,
      };
    }

    return null;
  },

  // Get all machines - combines Prisma and static data
  async getAll(): Promise<UnifiedMachine[]> {
    const machines: UnifiedMachine[] = [];

    try {
      // Get from Prisma
      const dbMachines = await prisma.machine.findMany({
        where: { is_available: true },
        include: { category: true },
      });

      for (const machine of dbMachines) {
        machines.push({
          id: machine.id,
          slug: machine.slug,
          name: machine.name,
          description: machine.description,
          image: machine.image,
          gallery: machine.gallery,
          category: machine.category.name,
          type: machine.type,
          price: machine.price,
          specifications: machine.specifications as Record<string, any>,
          input: machine.input,
          output: machine.output,
          process: machine.process,
          features: machine.features,
          applications: machine.applications,
          isAvailable: machine.is_available,
          stockQuantity: machine.stock_quantity,
        });
      }
    } catch (error) {
      console.error("Error fetching machines from database:", error);
    }

    // If no machines from DB, use static data
    if (machines.length === 0) {
      for (const machine of machinesData) {
        machines.push({
          id: machine.id.toString(),
          slug: machine.slug,
          name: machine.name,
          description: machine.description,
          image: machine.image,
          gallery: machine.gallery,
          category: machine.category,
          type: machine.type,
          price: machine.price,
          input: machine.input,
          output: machine.output,
          process: machine.process,
          features: machine.features,
          applications: machine.applications,
        });
      }
    }

    return machines;
  },

  // Get machines by category
  async getByCategory(categoryName: string): Promise<UnifiedMachine[]> {
    const allMachines = await this.getAll();
    return allMachines.filter((m) => m.category === categoryName);
  },

  // Search machines
  async search(query: string): Promise<UnifiedMachine[]> {
    const allMachines = await this.getAll();
    const lowerQuery = query.toLowerCase();
    return allMachines.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.description?.toLowerCase().includes(lowerQuery) ||
        m.type.toLowerCase().includes(lowerQuery),
    );
  },
};

// Order data service
export const orderService = {
  // Get order by order number and customer email/phone (for customer tracking)
  async getByOrderNumberAndContact(
    orderNumber: string,
    email?: string,
    phone?: string,
  ): Promise<UnifiedOrder | null> {
    try {
      const order = await prisma.order.findUnique({
        where: { order_number: orderNumber },
        include: {
          items: {
            include: {
              machine: true,
            },
          },
        },
      });

      if (!order) {
        return null;
      }

      // Verify contact information
      if (email && order.customer_email.toLowerCase() !== email.toLowerCase()) {
        return null;
      }

      if (phone && order.customer_phone !== phone) {
        return null;
      }

      return {
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        status: order.status,
        paymentStatus: order.payment_status,
        total: order.total,
        items: order.items.map((item) => ({
          id: item.id,
          productName: item.product_name,
          productSku: item.product_sku,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        trackingNumber: order.tracking_number,
        shippedAt: order.shipped_at,
        deliveredAt: order.delivered_at,
        createdAt: order.created_at,
      };
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  },

  // Get order by ID (for admin)
  async getById(orderId: string): Promise<UnifiedOrder | null> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              machine: true,
            },
          },
        },
      });

      if (!order) {
        return null;
      }

      return {
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        status: order.status,
        paymentStatus: order.payment_status,
        total: order.total,
        items: order.items.map((item) => ({
          id: item.id,
          productName: item.product_name,
          productSku: item.product_sku,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        trackingNumber: order.tracking_number,
        shippedAt: order.shipped_at,
        deliveredAt: order.delivered_at,
        createdAt: order.created_at,
      };
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  },

  // Get all orders (for admin)
  async getAll(filters?: {
    status?: string;
    paymentStatus?: string;
    limit?: number;
    offset?: number;
  }): Promise<UnifiedOrder[]> {
    try {
      const orders = await prisma.order.findMany({
        where: {
          ...(filters?.status && { status: filters.status }),
          ...(filters?.paymentStatus && { payment_status: filters.paymentStatus }),
        },
        include: {
          items: true,
        },
        orderBy: { created_at: "desc" },
        take: filters?.limit,
        skip: filters?.offset,
      });

      return orders.map((order) => ({
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        status: order.status,
        paymentStatus: order.payment_status,
        total: order.total,
        items: order.items.map((item) => ({
          id: item.id,
          productName: item.product_name,
          productSku: item.product_sku,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        trackingNumber: order.tracking_number,
        shippedAt: order.shipped_at,
        deliveredAt: order.delivered_at,
        createdAt: order.created_at,
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },
};

// Category data service
export const categoryService = {
  async getAll(): Promise<{ id: string; name: string; slug: string }[]> {
    try {
      const categories = await prisma.category.findMany({
        where: { is_active: true },
        orderBy: { display_order: "asc" },
      });

      return categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  async getBySlug(slug: string): Promise<{ id: string; name: string; slug: string; description?: string } | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
      });

      if (!category) return null;

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      };
    } catch (error) {
      console.error("Error fetching category:", error);
      return null;
    }
  },
};
