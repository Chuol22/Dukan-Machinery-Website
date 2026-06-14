"use client";

// OrderSummary — post-submit confirmation with order details and next steps
import {
  Download,
  Mail,
  Package,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Shield,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderSummaryProps {
  orderData: any;
  type: "standard" | "custom";
}

export default function OrderSummary({ orderData, type }: OrderSummaryProps) {
  const router = useRouter();

  // Download order JSON as a file
  const handleDownload = () => {
    const dataStr = JSON.stringify(orderData, null, 2);
    const link = document.createElement("a");
    link.href =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    link.download = `order-${orderData.orderId || Date.now()}.json`;
    link.click();
  };

  const CONTACT_EMAIL = "geletupro@gmail.com";
  const CONTACT_PHONE = "+251 912 713 823";

  // Open mail client with pre-filled order details
  const handleEmail = () => {
    const safeOrderId =
      (orderData as { orderId?: number | string } | undefined)?.orderId ?? "";

    const buildBody = () => {
      const standard = orderData?.customerInfo || orderData?.contactInfo;

      const machineLine =
        type === "standard"
          ? `Machine: ${orderData?.machineName || "-"}`
          : `Request Type: Custom`;

      const lines: string[] = [
        "Thank you for your order!",
        "",
        `Order ID: ${safeOrderId}`,
        `Type: ${type}`,
        "",
        "--- Details ---",
        machineLine,
      ];

      if (type === "standard") {
        lines.push(`Quantity: ${orderData?.quantity ?? "-"}`);
        lines.push(`Unit Price (numeric): ${orderData?.unitPrice ?? 0}`);
        lines.push(`Total Price (numeric): ${orderData?.totalPrice ?? 0}`);
      } else {
        lines.push(`Feed Type: ${orderData?.feedType ?? "-"}`);
        lines.push(`Power Source: ${orderData?.powerSource ?? "-"}`);
        lines.push(
          `Capacity: ${orderData?.requiredCapacity?.value ?? "-"} ${orderData?.requiredCapacity?.unit ?? ""}`.trim(),
        );
        lines.push(`Timeline: ${orderData?.timeline ?? "-"}`);
      }

      lines.push("", "--- Customer ---");
      lines.push(`Name: ${standard?.fullName || standard?.name || "-"}`);
      lines.push(
        `Company: ${standard?.companyName || standard?.company || "-"}`,
      );
      lines.push(`Email: ${standard?.email || "-"}`);
      lines.push(`Phone: ${standard?.phone || "-"}`);

      lines.push("", "--- Delivery / Requirements ---");
      lines.push(
        `Preferred Date: ${orderData?.deliveryInfo?.preferredDate ?? "-"}`,
      );
      lines.push(
        `Delivery Address: ${orderData?.deliveryInfo?.deliveryAddress ?? "-"}`,
      );
      lines.push(
        `Special Instructions: ${orderData?.deliveryInfo?.specialInstructions ?? "-"}`,
      );

      lines.push("", "--- Payment ---");
      lines.push(`Payment Method: ${orderData?.paymentMethod ?? "-"}`);
      lines.push(`Terms Accepted: ${orderData?.termsAccepted ? "Yes" : "No"}`);

      lines.push("", "--- Raw Order (for reference) ---");
      lines.push(JSON.stringify(orderData, null, 2));

      return lines.join("%0A");
    };

    const body = buildBody();

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `New Order Request - Dukan Machinery (DUK-${safeOrderId})`,
    )}&body=${body}`;
  };

  const handlePlaceAnotherOrder = () => {
    router.push("/machines");
  };

  const getStatusIcon = () => {
    if (orderData.status === "confirmed")
      return <CheckCircle className="w-16 h-16 text-green-500" />;
    if (orderData.status === "cancelled")
      return <AlertCircle className="w-16 h-16 text-red-500" />;
    return <Package className="w-16 h-16 text-primary" />;
  };

  // Status headline based on order state
  const getStatusText = () => {
    if (orderData.status === "confirmed") return "Order Confirmed";
    if (orderData.status === "cancelled") return "Order Cancelled";
    return "Order Received";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Success Banner - Shows prominently that order is placed */}
      <div className="m-4 mb-0 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-green-800 dark:text-green-300 text-lg">
              Order Placed Successfully!
            </h4>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              Your order has been received and is pending review. Our team will
              contact you within 24 hours.
            </p>
            <button
              onClick={handlePlaceAnotherOrder}
              className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Place Another Order
            </button>
          </div>
        </div>
      </div>

      {/* Order status header */}
      <div className="bg-linear-to-r from-primary to-primary-dark px-6 py-8 text-white text-center">
        {getStatusIcon()}
        <h2 className="text-2xl font-bold mt-4">{getStatusText()}</h2>
        <p className="text-white/80 mt-1">Order ID: {orderData.orderId}</p>
        <p className="text-white/60 text-sm mt-1">
          {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
      </div>

      <div className="p-6 md:p-8">
        {/* Download and email actions */}
        <div className="flex justify-end gap-3 mb-6 print:hidden">
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 hover:text-primary"
            title="Download order"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleEmail}
            className="p-2 text-gray-600 hover:text-primary"
            title="Email order"
          >
            <Mail className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Customer details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {orderData.customerInfo?.fullName ||
                  orderData.contactInfo?.name}
              </p>
              <p className="mt-1">
                <span className="font-medium">Company:</span>{" "}
                {orderData.customerInfo?.companyName ||
                  orderData.contactInfo?.company}
              </p>
              <p className="mt-1">
                <span className="font-medium">Email:</span>{" "}
                {orderData.customerInfo?.email || orderData.contactInfo?.email}
              </p>
              <p className="mt-1">
                <span className="font-medium">Phone:</span>{" "}
                {orderData.customerInfo?.phone || orderData.contactInfo?.phone}
              </p>
            </div>
          </div>

          {/* Order line items */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              {type === "standard" ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Machine:</span>
                    <span>{orderData.machineName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Quantity:</span>
                    <span>{orderData.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Unit Price:</span>
                    <span>ETB {orderData.unitPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-primary text-lg">
                      ETB {orderData.totalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Feed Type:</span>
                    <span>{orderData.feedType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Capacity:</span>
                    <span>
                      {orderData.requiredCapacity?.value}{" "}
                      {orderData.requiredCapacity?.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium capitalize">
                      Power Source:
                    </span>
                    <span>{orderData.powerSource}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium capitalize">Timeline:</span>
                    <span>{orderData.timeline}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {orderData.paymentMethod && (
            <div>
              {/* Payment method */}
              <h3 className="text-lg font-semibold mb-3">
                Payment Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="font-medium capitalize">
                    {orderData.paymentMethod.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Post-order timeline */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Next Steps</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">1</span>
                </div>
                <p>
                  Our sales team will contact you within{" "}
                  <strong className="text-primary">24 hours</strong> to confirm
                  your order.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">2</span>
                </div>
                <p>
                  You will receive a proforma invoice and payment instructions
                  via email.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">3</span>
                </div>
                <p>
                  Production begins after payment confirmation. Lead time: 2-3
                  weeks.
                </p>
              </div>
            </div>
          </div>

          {/* Support contact info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Need help with your order?
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Contact us at <strong>{CONTACT_EMAIL}</strong> or call{" "}
                <strong>{CONTACT_PHONE}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
