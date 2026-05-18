import { NextRequest, NextResponse } from "next/server";
import { validateContactForm, sanitizeString } from "@/lib/validation";
import { Resend } from "resend";

// Simple in-memory rate limiting to prevent spam floods
const rateLimitMap = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const lastRequestTime = rateLimitMap.get(ip) || 0;

    // Limit to 1 request every 5 seconds per IP
    if (now - lastRequestTime < 5000) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }
    rateLimitMap.set(ip, now);

    const body = await req.json();
    const { name, email, phone, service, message, honeypot } = body;

    // 1. Honeypot check (Instantly return success to fool bots)
    if (honeypot && honeypot.trim().length > 0) {
      console.log(`[Honeypot Triggered] Blocked submission from IP ${ip}`);
      await new Promise((res) => setTimeout(res, 800));
      return NextResponse.json({ success: true, message: "Message submitted successfully." });
    }

    // 2. Validate inputs
    const { isValid, errors } = validateContactForm({ name, email, service, message });
    if (!isValid) {
      return NextResponse.json({ error: "Invalid form data.", details: errors }, { status: 400 });
    }

    // 3. Sanitize inputs to prevent injection/XSS
    const cleanName = sanitizeString(name);
    const cleanEmail = sanitizeString(email);
    const cleanPhone = phone ? sanitizeString(phone) : "";
    const cleanService = sanitizeString(service);
    const cleanMessage = sanitizeString(message);

    console.log("=========================================");
    console.log("NEW CONTACT FORM SUBMISSION RECEIVED");
    console.log(`IP: ${ip}`);
    console.log(`Name: ${cleanName}`);
    console.log(`Email: ${cleanEmail}`);
    console.log(`Phone: ${cleanPhone}`);
    console.log(`Service: ${cleanService}`);
    console.log(`Message:\n${cleanMessage}`);
    console.log("=========================================");

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const toEmail = process.env.CONTACT_RECEIVER_EMAIL || "technicalcorp700@gmail.com";

    // Detect if Resend is fully configured (not dummy value)
    const isResendConfigured = apiKey && apiKey !== "re_your_api_key_here" && apiKey.trim().length > 0;

    if (isResendConfigured) {
      const resend = new Resend(apiKey);
      
      const emailResult = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: `New Lead: ${cleanName} - ${cleanService}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #4f46e5; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; margin-top: 0;">New Lead Submission</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #374151;">Full Name:</td>
                <td style="padding: 8px 0; color: #4b5563;">${cleanName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email Address:</td>
                <td style="padding: 8px 0; color: #4b5563;"><a href="mailto:${cleanEmail}">${cleanEmail}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td>
                <td style="padding: 8px 0; color: #4b5563;">${cleanPhone || "Not provided"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Service Interest:</td>
                <td style="padding: 8px 0; color: #4b5563;">${cleanService}</td>
              </tr>
            </table>

            <div style="margin-top: 20px;">
              <h3 style="color: #374151; margin-bottom: 8px;">Project Details / Message:</h3>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #f3f4f6; color: #4b5563; white-space: pre-wrap; line-height: 1.6;">${cleanMessage}</div>
            </div>
            
            <div style="margin-top: 25px; border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 12px; color: #9ca3af; text-align: center;">
              This email was sent dynamically via <strong>Ai Ka Fanda</strong>'s Contact Form API route.
            </div>
          </div>
        `,
      });

      if (emailResult.error) {
        console.error("[Resend API Error]:", emailResult.error);
        return NextResponse.json(
          { error: `Failed to deliver email: ${emailResult.error.message}` },
          { status: 500 }
        );
      }
    } else {
      console.warn("⚠️ [Resend Email Route]: Resend is not configured (dummy or missing API key). Submission logged in console.");
      // In development/fallback mode, simulate email delivery delay
      await new Promise((res) => setTimeout(res, 1200));
    }

    return NextResponse.json({
      success: true,
      message: "Message submitted successfully.",
    });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
  }
}
