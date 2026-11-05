import { Order, CartItem, OrderStatus, VerifiedSlip } from "@/types";
import { MOCK_PRODUCTS } from "@/data/mockProducts";

// Singleton storage in globalThis to survive Next.js Fast Refresh and route isolation
interface GlobalStore {
  orders: Map<string, Order>;
  verifiedSlips: Map<string, VerifiedSlip>;
}

declare global {
  // eslint-disable-next-line no-var
  var __classpic_store__: GlobalStore | undefined;
}

function initStore(): GlobalStore {
  if (globalThis.__classpic_store__) {
    return globalThis.__classpic_store__;
  }

  const orders = new Map<string, Order>();
  const verifiedSlips = new Map<string, VerifiedSlip>();

  // Seed sample orders for immediate testing
  const seedSlip1: VerifiedSlip = {
    trans_ref: "TR-DEMO-998877",
    amount: 59,
    sender_bank: "KBANK",
    receiver_bank: "SCB",
    verified_at: new Date(Date.now() - 3600000).toISOString(),
    order_id: "CP-20261105-001"
  };
  verifiedSlips.set(seedSlip1.trans_ref, seedSlip1);

  orders.set("CP-20261105-001", {
    id: "CP-20261105-001",
    customer_contact: "081-234-5678",
    total_amount: 59,
    status: "PAID",
    items: [
      {
        product: MOCK_PRODUCTS[0],
        quantity: 1
      }
    ],
    trans_ref: "TR-DEMO-998877",
    paid_at: new Date(Date.now() - 3600000).toISOString(),
    created_at: new Date(Date.now() - 7200000).toISOString()
  });

  const seedSlip2: VerifiedSlip = {
    trans_ref: "TR-DEMO-554433",
    amount: 79,
    sender_bank: "BBL",
    receiver_bank: "SCB",
    verified_at: new Date(Date.now() - 1800000).toISOString(),
    order_id: "CP-20261105-002"
  };
  verifiedSlips.set(seedSlip2.trans_ref, seedSlip2);

  orders.set("CP-20261105-002", {
    id: "CP-20261105-002",
    customer_contact: "teacher@example.com",
    total_amount: 79,
    status: "PAID",
    items: [
      {
        product: MOCK_PRODUCTS[1],
        quantity: 1
      }
    ],
    trans_ref: "TR-DEMO-554433",
    paid_at: new Date(Date.now() - 1800000).toISOString(),
    created_at: new Date(Date.now() - 3600000).toISOString()
  });

  // Seed a pending order waiting for slip upload
  orders.set("CP-20261105-003", {
    id: "CP-20261105-003",
    customer_contact: "089-999-8888",
    total_amount: 59,
    status: "PENDING",
    items: [
      {
        product: MOCK_PRODUCTS[0],
        quantity: 1
      }
    ],
    created_at: new Date().toISOString()
  });

  const store = { orders, verifiedSlips };
  globalThis.__classpic_store__ = store;
  return store;
}

const store = initStore();

/**
 * สร้างรหัสออเดอร์ใหม่ในรูปแบบ CP-YYYYMMDD-XXXX
 */
export function generateOrderId(): string {
  const now = new Date();
  const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CP-${yyyymmdd}-${randomSuffix}`;
}

/**
 * สร้างคำสั่งซื้อใหม่ (Order)
 */
export function createOrder(
  contact: string,
  items: CartItem[],
  totalAmount: number
): Order {
  const id = generateOrderId();
  const order: Order = {
    id,
    customer_contact: contact.trim(),
    total_amount: totalAmount,
    status: "PENDING",
    items,
    created_at: new Date().toISOString()
  };

  store.orders.set(id, order);
  return order;
}

/**
 * ดึงข้อมูลออเดอร์ตามรหัส orderId
 */
export function getOrder(orderId: string): Order | undefined {
  return store.orders.get(orderId);
}

/**
 * ค้นหาประวัติคำสั่งซื้อทั้งหมดของลูกค้าตามเบอร์โทรศัพท์หรืออีเมล
 */
export function findOrdersByContact(contact: string): Order[] {
  const normalizedSearch = contact.trim().toLowerCase().replace(/[\s-]/g, "");
  if (!normalizedSearch) return [];

  const results: Order[] = [];
  for (const order of store.orders.values()) {
    const normalizedContact = order.customer_contact.trim().toLowerCase().replace(/[\s-]/g, "");
    if (
      normalizedContact === normalizedSearch ||
      normalizedContact.includes(normalizedSearch) ||
      normalizedSearch.includes(normalizedContact)
    ) {
      results.push(order);
    }
  }

  // เรียงจากออเดอร์ล่าสุดไปเก่าสุด
  return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * ตรวจสอบว่ารหัสอ้างอิงสลิปธนาคาร (TransRef) เคยถูกบันทึกหรือใช้งานไปแล้วหรือไม่
 */
export function isSlipUsed(transRef: string): boolean {
  if (!transRef) return false;
  return store.verifiedSlips.has(transRef.trim().toUpperCase());
}

/**
 * บันทึกสลิปที่ตรวจสอบผ่านแล้วลงใน verified_slips เพื่อป้องกันการใช้ซ้ำ 100%
 */
export function recordVerifiedSlip(slip: VerifiedSlip): void {
  store.verifiedSlips.set(slip.trans_ref.trim().toUpperCase(), slip);
}

/**
 * ดึงข้อมูลสลิปที่บันทึกไว้
 */
export function getVerifiedSlip(transRef: string): VerifiedSlip | undefined {
  return store.verifiedSlips.get(transRef.trim().toUpperCase());
}

/**
 * ปรับสถานะคำสั่งซื้อเป็น PAID (ชำระเงินเรียบร้อย)
 */
export function markOrderPaid(
  orderId: string,
  transRef?: string,
  slipUrl?: string,
  status: OrderStatus = "PAID"
): Order | null {
  const order = store.orders.get(orderId);
  if (!order) return null;

  order.status = status;
  order.paid_at = new Date().toISOString();
  if (transRef) order.trans_ref = transRef;
  if (slipUrl) order.slip_image_url = slipUrl;

  store.orders.set(orderId, order);
  return order;
}

/**
 * ดึงรายการออเดอร์ทั้งหมด (สำหรับ Admin)
 */
export function getAllOrders(): Order[] {
  return Array.from(store.orders.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
