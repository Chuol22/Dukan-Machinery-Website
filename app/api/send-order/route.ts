// app/api/send-order/route.ts
import { NextRequest, NextResponse } from 'next/server';

let nodemailerModule: unknown = null;
try {
  // Note: load dynamically so `next build` doesn't require nodemailer at build time.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodemailerModule = eval("require('nodemailer')") as any;
} catch {
  nodemailerModule = null;
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    if (!nodemailerModule) {
      return NextResponse.json(
        { success: false, message: 'Email service not configured (nodemailer missing)' },
        { status: 500 }
      );
    }

    // Configure email transporter
    const transporter = (nodemailerModule as { createTransport: (opts: Record<string, unknown>) => { sendMail: (args: unknown) => Promise<unknown> } }).createTransport({





      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Format currency
    const formatCurrency = (amount: number) => {
      return `ETB ${amount.toLocaleString()}`;
    };

    // Format date
    const formatDate = (dateString: string) => {
      if (!dateString) return 'Not specified';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    // Get machine name from ID
    const getMachineName = (machineId: string) => {
      const machines: Record<string, string> = {
        '1': 'Cow Dung Drying Machine',
        '2': 'Organic Fertilizer Pellet Machine',
        '3': 'Feed Mixer Machine',
        '4': 'Chicken Feed Mill Machine',
        '5': 'Poultry Feed Pellet Machine',
      };
      return machines[machineId] || orderData.machineName || 'Unknown Machine';
    };

    const machineName = getMachineName(orderData.machineId);
    const totalAmount = orderData.totalPrice || 0;
    const unitPrice = orderData.unitPrice || 0;

    // Create HTML email template
    const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order #${orderData.orderId}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 0;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .header p {
            margin: 10px 0 0;
            opacity: 0.9;
          }
          .content {
            padding: 30px;
          }
          .section {
            margin-bottom: 30px;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #f97316;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #f97316;
            display: inline-block;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 140px 1fr;
            gap: 10px;
            margin-top: 15px;
          }
          .info-label {
            font-weight: bold;
            color: #555;
          }
          .info-value {
            color: #333;
          }
          .order-items {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
          }
          .order-item {
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .order-item:last-child {
            border-bottom: none;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding-top: 10px;
            margin-top: 10px;
            border-top: 2px solid #f97316;
            font-weight: bold;
            font-size: 18px;
          }
          .status-badge {
            display: inline-block;
            background-color: #fef3c7;
            color: #d97706;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
          }
          .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
          .next-steps {
            background-color: #f0fdf4;
            border-left: 4px solid #22c55e;
            padding: 15px;
            margin-top: 20px;
            border-radius: 4px;
          }
          .next-steps ol {
            margin: 10px 0 0 20px;
            padding-left: 0;
          }
          .next-steps li {
            margin: 8px 0;
          }
          @media (max-width: 480px) {
            .content {
              padding: 20px;
            }
            .info-grid {
              grid-template-columns: 1fr;
              gap: 5px;
            }
            .info-label {
              margin-top: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛒 NEW ORDER RECEIVED</h1>
            <p>Order #${orderData.orderId}</p>
            <div class="status-badge" style="background: rgba(255,255,255,0.2); color: white; margin-top: 10px;">
              PENDING CONFIRMATION
            </div>
          </div>
          
          <div class="content">
            <div class="section">
              <h3 class="section-title">👤 CUSTOMER INFORMATION</h3>
              <div class="info-grid">
                <div class="info-label">Full Name:</div>
                <div class="info-value">${orderData.customerInfo?.fullName || 'N/A'}</div>
                <div class="info-label">Company:</div>
                <div class="info-value">${orderData.customerInfo?.companyName || 'N/A'}</div>
                <div class="info-label">Email:</div>
                <div class="info-value">${orderData.customerInfo?.email || 'N/A'}</div>
                <div class="info-label">Phone:</div>
                <div class="info-value">${orderData.customerInfo?.phone || 'N/A'}</div>
                <div class="info-label">Address:</div>
                <div class="info-value">${orderData.customerInfo?.address || 'N/A'}</div>
                <div class="info-label">City:</div>
                <div class="info-value">${orderData.customerInfo?.city || 'N/A'}</div>
              </div>
            </div>
            
            <div class="section">
              <h3 class="section-title">📦 ORDER DETAILS</h3>
              <div class="order-items">
                <div class="order-item">
                  <div class="info-grid">
                    <div class="info-label">Product:</div>
                    <div class="info-value"><strong>${machineName}</strong></div>
                    <div class="info-label">Quantity:</div>
                    <div class="info-value">${orderData.quantity} unit(s)</div>
                    <div class="info-label">Unit Price:</div>
                    <div class="info-value">${unitPrice > 0 ? formatCurrency(unitPrice) : 'Call for price'}</div>
                  </div>
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
                <div class="info-label">Preferred Date:</div>
                <div class="info-value">${formatDate(orderData.deliveryInfo?.preferredDate)}</div>
                <div class="info-label">Delivery Address:</div>
                <div class="info-value">${orderData.deliveryInfo?.deliveryAddress || 'N/A'}</div>
                <div class="info-label">Special Instructions:</div>
                <div class="info-value">${orderData.deliveryInfo?.specialInstructions || 'None'}</div>
              </div>
            </div>
            
            <div class="section">
              <h3 class="section-title">💰 PAYMENT INFORMATION</h3>
              <div class="info-grid">
                <div class="info-label">Payment Method:</div>
                <div class="info-value">
                  ${orderData.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                    orderData.paymentMethod === 'letter_of_credit' ? 'Letter of Credit' : 
                    'Credit Card'}
                </div>
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
            <p>Contact: geletupro@gmail.com | +251 912 713 823</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to YOU (sales officer)
    await transporter.sendMail({
      from: `"Dukan Machinery Orders" <${process.env.EMAIL_USER}>`,
      to: process.env.NOTIFICATION_EMAIL || 'cnyuondak@gmail.com',
      subject: `🛒 NEW ORDER #${orderData.orderId} - ${machineName}`,
      html: htmlEmail,
    });

    // Send confirmation email to CUSTOMER
    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Order Confirmation</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #f97316;">✓ Order Confirmed!</h2>
          <p>Dear ${orderData.customerInfo?.fullName},</p>
          <p>Thank you for your order from <strong>Dukan Machinery</strong>.</p>
          <p><strong>Order #:</strong> ${orderData.orderId}</p>
          <p><strong>Product:</strong> ${machineName}</p>
          <p><strong>Quantity:</strong> ${orderData.quantity}</p>
          <p><strong>Total:</strong> ${totalAmount > 0 ? formatCurrency(totalAmount) : 'Price on request'}</p>
          <hr>
          <p>Our sales team will contact you within <strong>24 hours</strong> to confirm your order.</p>
          <p>Thank you for choosing Dukan Machinery!</p>
          <br>
          <p style="font-size: 12px; color: #666;">Dukan Machinery | +251 912 713 823 | geletupro@gmail.com</p>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Dukan Machinery" <${process.env.EMAIL_USER}>`,
      to: orderData.customerInfo?.email,
      subject: `✓ Order Confirmed #${orderData.orderId} - Dukan Machinery`,
      html: customerHtml,
    });

    return NextResponse.json({ success: true, message: 'Order sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send order' },
      { status: 500 }
    );
  }
}