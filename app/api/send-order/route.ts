// send-order/route.ts — public order submission, DB save, emails, admin alerts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { machinesData } from '@/data/machinesData';
import { prisma } from '@/lib/prisma';

// ============================================
// 1. UTILITY FUNCTIONS
// ============================================
const newUuid = () => {
  return globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `00000000-0000-4000-8000-000000000000`;
};

const formatCurrency = (amount: number): string => {
  if (!amount || amount <= 0) return 'Price on request';
  return `ETB ${amount.toLocaleString()}`;
};

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Not specified';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
};

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}${random}`;
};

// ============================================
// 2. EMAIL TRANSPORTER (Gmail SMTP)
// ============================================
function getEmailTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass || pass === 'your_gmail_app_password') {
    console.warn('⚠️ Email credentials not configured. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

// ============================================
// 3. EMAIL TEMPLATES
// ============================================
type OrderSubmissionPayload = {
  orderNumber?: string;
  machineId: string;
  machineName?: string;
  unitPrice?: number;
  totalPrice?: number;
  quantity: number;
  paymentMethod?: string;
  termsAccepted?: boolean;
  customerInfo?: {
    fullName?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
  deliveryInfo?: {
    preferredDate?: string;
    deliveryAddress?: string;
    specialInstructions?: string;
  };
};

function buildAdminEmailHTML(orderData: OrderSubmissionPayload & { orderNumber: string }, machineName: string, unitPrice: number, totalAmount: number): string {
  const customerInfo = orderData.customerInfo || {};
  const deliveryInfo = orderData.deliveryInfo || {};

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order #${orderData.orderNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .status-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-top: 10px; }
    .content { padding: 30px; }
    .section { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
    .section-title { font-size: 18px; font-weight: bold; color: #f97316; margin-bottom: 15px; border-bottom: 2px solid #f97316; display: inline-block; }
    .info-grid { display: grid; grid-template-columns: 140px 1fr; gap: 10px; margin-top: 15px; }
    .info-label { font-weight: bold; color: #555; }
    .info-value { color: #333; }
    .order-items { background: #f9fafb; border-radius: 8px; padding: 15px; margin-top: 15px; }
    .total-row { display: flex; justify-content: space-between; padding-top: 10px; margin-top: 10px; border-top: 2px solid #f97316; font-weight: bold; font-size: 18px; }
    .next-steps { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin-top: 20px; border-radius: 4px; }
    .next-steps ol { margin: 10px 0 0 20px; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
    @media (max-width: 480px) {
      .content { padding: 20px; }
      .info-grid { grid-template-columns: 1fr; gap: 5px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛒 NEW ORDER RECEIVED</h1>
      <p>Order #${orderData.orderNumber}</p>
      <div class="status-badge">PENDING CONFIRMATION</div>
    </div>
    <div class="content">
      <div class="section">
        <h3 class="section-title">👤 CUSTOMER INFORMATION</h3>
        <div class="info-grid">
          <div class="info-label">Full Name:</div><div class="info-value">${customerInfo.fullName || 'N/A'}</div>
          <div class="info-label">Company:</div><div class="info-value">${customerInfo.companyName || 'N/A'}</div>
          <div class="info-label">Email:</div><div class="info-value">${customerInfo.email || 'N/A'}</div>
          <div class="info-label">Phone:</div><div class="info-value">${customerInfo.phone || 'N/A'}</div>
          <div class="info-label">Address:</div><div class="info-value">${customerInfo.address || 'N/A'}</div>
          <div class="info-label">City:</div><div class="info-value">${customerInfo.city || 'N/A'}</div>
        </div>
      </div>
      <div class="section">
        <h3 class="section-title">📦 ORDER DETAILS</h3>
        <div class="order-items">
          <div class="info-grid">
            <div class="info-label">Product:</div><div class="info-value"><strong>${machineName}</strong></div>
            <div class="info-label">Quantity:</div><div class="info-value">${orderData.quantity} unit(s)</div>
            <div class="info-label">Unit Price:</div><div class="info-value">${unitPrice > 0 ? formatCurrency(unitPrice) : 'Call for price'}</div>
          </div>
          <div class="total-row">
            <span>TOTAL AMOUNT:</span>
            <span style="color: #f97316; font-size: 22px;">${totalAmount > 0 ? formatCurrency(totalAmount) : 'Price on request'}</span>
          </div>
        </div>
      </div>
      <div class="section">
        <h3 class="section-title">🚚 DELIVERY INFORMATION</h3>
        <div class="info-grid">
          <div class="info-label">Preferred Date:</div><div class="info-value">${formatDate(deliveryInfo.preferredDate)}</div>
          <div class="info-label">Delivery Address:</div><div class="info-value">${deliveryInfo.deliveryAddress || 'N/A'}</div>
          <div class="info-label">Special Instructions:</div><div class="info-value">${deliveryInfo.specialInstructions || 'None'}</div>
        </div>
      </div>
      <div class="section">
        <h3 class="section-title">💰 PAYMENT INFORMATION</h3>
        <div class="info-grid">
          <div class="info-label">Payment Method:</div>
          <div class="info-value">${orderData.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : orderData.paymentMethod === 'letter_of_credit' ? 'Letter of Credit' : 'Credit Card'}</div>
        </div>
      </div>
      <div class="next-steps">
        <strong>📋 NEXT STEPS</strong>
        <ol>
          <li>Contact customer within 24 hours to confirm order</li>
          <li>Send proforma invoice and payment instructions</li>
          <li>Begin production after payment confirmation (2-3 weeks lead time)</li>
        </ol>
      </div>
    </div>
    <div class="footer">
      <p>Dukan Machinery - Agri-Industrial Solutions</p>
      <p>This is an automated notification. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `;
}

function buildCustomerEmailHTML(orderData: OrderSubmissionPayload & { orderNumber: string }, machineName: string, totalAmount: number): string {
  const customerInfo = orderData.customerInfo || {};

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 500px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 20px; }
    h2 { color: #f97316; }
    .order-details { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>✓ Order Confirmed!</h2>
    </div>
    <p>Dear ${customerInfo.fullName || 'Customer'},</p>
    <p>Thank you for your order from <strong>Dukan Machinery</strong>.</p>
    <div class="order-details">
      <p><strong>Order #:</strong> ${orderData.orderNumber}</p>
      <p><strong>Product:</strong> ${machineName}</p>
      <p><strong>Quantity:</strong> ${orderData.quantity} unit(s)</p>
      <p><strong>Total:</strong> ${totalAmount > 0 ? formatCurrency(totalAmount) : 'Price on request'}</p>
    </div>
    <p>Our sales team will contact you within <strong>24 hours</strong> to confirm your order and provide payment instructions.</p>
    <p>Thank you for choosing Dukan Machinery!</p>
    <div class="footer">
      <p>Dukan Machinery | Agri-Industrial Solutions</p>
      <p>Questions? Reply to this email or call us at +251 912 713 823</p>
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================
// 4. MAIN POST HANDLER WITH DEBUG LOGGING
// ============================================
export async function POST(request: NextRequest) {
  console.log('='.repeat(60));
  console.log('📦 [send-order] Processing new order request...');
  console.log('='.repeat(60));

  try {
    // Parse request body
    console.log('📍 Step 1: Parsing request body...');
    const orderData = await request.json();
    console.log('✅ Request body parsed');
    console.log('📋 Order data:', JSON.stringify({
      orderNumber: orderData.orderNumber,
      machineId: orderData.machineId,
      quantity: orderData.quantity,
      customerEmail: orderData.customerInfo?.email,
      paymentMethod: orderData.paymentMethod,
      hasCustomerInfo: !!orderData.customerInfo,
      hasDeliveryInfo: !!orderData.deliveryInfo,
    }, null, 2));

    // Validate required fields
    console.log('📍 Step 2: Validating required fields...');
    const customerInfo = orderData.customerInfo || {};
    if (!customerInfo.email) {
      console.error('❌ Missing customer email');
      return NextResponse.json(
        { success: false, message: 'Customer email is required' },
        { status: 400 }
      );
    }

    if (!orderData.machineId) {
      console.error('❌ Missing machine ID');
      return NextResponse.json(
        { success: false, message: 'Machine ID is required' },
        { status: 400 }
      );
    }

    if (!orderData.quantity || orderData.quantity < 1) {
      console.error('❌ Invalid quantity');
      return NextResponse.json(
        { success: false, message: 'Valid quantity is required' },
        { status: 400 }
      );
    }
    console.log('✅ Validation passed');

    // Get machine details
    console.log('📍 Step 3: Getting machine details...');
    const selectedMachine = machinesData.find(m => String(m.id) === String(orderData.machineId));
    const machineName = selectedMachine?.name || orderData.machineName || 'Unknown Machine';
    const totalAmount = orderData.totalPrice || 0;
    const unitPrice = orderData.unitPrice || 0;
    const orderNumber = orderData.orderNumber || generateOrderNumber();
    console.log(`✅ Machine: ${machineName}, Total: ${totalAmount}, Order #: ${orderNumber}`);

    // 1. Find or create Profile by email
    console.log('📍 Step 4: Finding/creating profile for:', customerInfo.email);
    let profile = await prisma.profile.findUnique({
      where: { email: customerInfo.email }
    });

    if (!profile) {
      console.log('📝 Creating new profile...');
      profile = await prisma.profile.create({
        data: {
          id: newUuid(),
          email: customerInfo.email,
          name: customerInfo.fullName ?? null,
          phone: customerInfo.phone ?? null,
          company: customerInfo.companyName ?? null,
          role: 'customer',
        }
      });
      console.log(`✅ Created new profile: ${profile.id}`);
    } else {
      console.log(`✅ Found existing profile: ${profile.id}`);
    }

    // 2. Create shipping address
    console.log('📍 Step 5: Creating shipping address...');
    const address = await prisma.address.create({
      data: {
        profile_id: profile.id,
        type: 'shipping',
        street: customerInfo.address || 'Not provided',
        city: customerInfo.city || 'Not provided',
        state: 'N/A',
        zip_code: 'N/A',
        country: 'Ethiopia',
      }
    });
    console.log(`✅ Created address: ${address.id}`);

    // 3. Create Order
    console.log('📍 Step 6: Creating order...');
    const order = await prisma.order.create({
      data: {
        order_number: orderNumber,
        profile_id: profile.id,
        customer_name: customerInfo.fullName || 'N/A',
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        shipping_address_id: address.id,
        subtotal: totalAmount,
        total: totalAmount,
        status: 'pending',
        payment_status: 'unpaid',
        payment_method: orderData.paymentMethod || 'bank_transfer',
        terms_accepted: orderData.termsAccepted === true,
        preferred_delivery_date:
          orderData.deliveryInfo?.preferredDate
            ? new Date(orderData.deliveryInfo.preferredDate as string)
            : null,
        delivery_address_text: orderData.deliveryInfo?.deliveryAddress || null,
        special_instructions: orderData.deliveryInfo?.specialInstructions || null,
      }
    });
    console.log(`✅ Created order: ${order.id} (${order.order_number})`);

    // 4. Create OrderItem
    console.log('📍 Step 7: Creating order item...');
    let machine = null;
    if (selectedMachine) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(orderData.machineId));
      machine = await prisma.machine.findFirst({
        where: {
          OR: [
            { slug: String(orderData.machineId) },
            ...(isUuid ? [{ id: String(orderData.machineId) }] : []),
          ]
        }
      });
    }

    if (!machine && selectedMachine) {
      console.log('📝 Creating new machine entry...');
      let category = await prisma.category.findFirst();
      if (!category) {
        category = await prisma.category.create({
          data: {
            slug: 'general',
            name: 'General Machinery',
          }
        });
      }
      machine = await prisma.machine.create({
        data: {
          slug: String(orderData.machineId),
          name: machineName,
          sku: `SKU-${orderData.machineId}`,
          category_id: category.id,
          type: 'standard',
        }
      });
      console.log(`✅ Created machine: ${machine.id}`);
    }

    if (machine) {
      await prisma.orderItem.create({
        data: {
          order_id: order.id,
          machine_id: machine.id,
          quantity: orderData.quantity,
          price: unitPrice,
          total: totalAmount,
          product_name: machineName,
          product_sku: `SKU-${orderData.machineId}`,
          product_image: selectedMachine?.image,
        }
      });
      console.log(`✅ Created order item`);
    } else {
      console.warn('⚠️ No machine created, skipping order item');
    }

    // 5. Create notification
    console.log('📍 Step 8: Creating notification...');
    await prisma.notification.create({
      data: {
        profile_id: profile.id,
        order_id: order.id,
        type: 'new_order',
        title: 'New Order Request',
        message: `New order #${orderNumber} from ${customerInfo.fullName || 'Customer'} - ${machineName}`,
        read: false,
      }
    });
    console.log('✅ Created notification');

    // 6. Send emails
    console.log('📍 Step 9: Sending emails...');
    const transporter = getEmailTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Dukan Machinery Orders" <${process.env.EMAIL_USER}>`,
          to: process.env.NOTIFICATION_EMAIL || 'admin@dukanmachinery.com',
          subject: `🛒 NEW ORDER #${orderNumber} - ${machineName}`,
          text: `New order received!\n\nOrder #: ${orderNumber}\nCustomer: ${customerInfo.fullName}\nProduct: ${machineName}\nQuantity: ${orderData.quantity}\nTotal: ${totalAmount}`,
        });
        console.log('📧 Admin email sent');

        await transporter.sendMail({
          from: `"Dukan Machinery" <${process.env.EMAIL_USER}>`,
          to: customerInfo.email,
          subject: `✓ Order Confirmed #${orderNumber} - Dukan Machinery`,
          text: `Thank you for your order!\n\nOrder #: ${orderNumber}\nProduct: ${machineName}\nQuantity: ${orderData.quantity}\nTotal: ${totalAmount}\n\nWe will contact you within 24 hours.`,
        });
        console.log('📧 Customer email sent');
      } catch (emailError) {
        console.error('⚠️ Email sending failed:', emailError);
      }
    } else {
      console.warn('⚠️ Email transporter not configured');
    }

    console.log('='.repeat(60));
    console.log('🎉 ORDER COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));

    return NextResponse.json({
      success: true,
      message: 'Order submitted successfully',
      orderNumber: orderNumber,
      orderId: order.id,
    });

  } catch (error) {
    console.error('='.repeat(60));
    console.error('❌ ORDER PROCESSING ERROR');
    console.error('='.repeat(60));
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:');
      console.error(error.stack);
    }
    console.error('='.repeat(60));

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process order',
      },
      { status: 500 }
    );
  }
}