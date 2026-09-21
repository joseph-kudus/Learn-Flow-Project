export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const {
      amount = 10,
      currency = "GHS",
      customerId,
      courseId = "test-course-1",
      courseTitle = "LearnFlow Test Course",
      userId = "test-user-1",
    } = req.body;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Missing Flutterwave customer ID.",
      });
    }

    // ==========================================
    // 1. Get Flutterwave v4 access token
    // ==========================================

    const tokenResponse = await fetch(
      "https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.FLW_CLIENT_ID,
          client_secret: process.env.FLW_CLIENT_SECRET,
          grant_type: "client_credentials",
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Flutterwave token error:", tokenData);

      return res.status(401).json({
        success: false,
        message: "Unable to authenticate with Flutterwave.",
      });
    }

    const accessToken = tokenData.access_token;

    // ==========================================
    // 2. Create sandbox Mobile Money payment method
    // ==========================================

    const paymentMethodResponse = await fetch(
      "https://developersandbox-api.flutterwave.com/payment-methods",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Trace-Id": crypto.randomUUID(),
          "X-Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          type: "mobile_money",
          mobile_money: {
            country_code: "233",
            network: "MTN",
            phone_number: "9012345678",
          },
        }),
      },
    );

    const paymentMethodData = await paymentMethodResponse.json();

    if (!paymentMethodResponse.ok || paymentMethodData.status !== "success") {
      console.error(
        "Payment method error:",
        paymentMethodResponse.status,
        paymentMethodData,
      );

      return res.status(paymentMethodResponse.status).json({
        success: false,
        message:
          paymentMethodData.message || "Unable to create test payment method.",
        flutterwaveStatus: paymentMethodData.status || "unknown",
      });
    }

    const paymentMethodId = paymentMethodData.data.id;

    // ==========================================
    // 3. Return test payment method
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Sandbox Mobile Money payment method created.",
      paymentMethodId,
      customerId,
      amount: Number(amount),
      currency,
      courseId,
      courseTitle,
      userId,
    });
  } catch (error) {
    console.error("Test Mobile Money error:", error);

    return res.status(500).json({
      success: false,
      message: "Sandbox payment method creation failed.",
    });
  }
}
