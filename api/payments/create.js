export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const {
      amount,
      currency = "USD",
      email,
      name,
      courseId,
      courseTitle,
      userId,
    } = req.body;

    if (!amount || !email || !name || !courseId || !courseTitle || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing payment information.",
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
    // 2. Create Flutterwave customer
    // ==========================================

    const customerResponse = await fetch(
      "https://developersandbox-api.flutterwave.com/customers",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Trace-Id": crypto.randomUUID(),
          "X-Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          email,
          name: {
            first: name,
          },
        }),
      },
    );

    const customerData = await customerResponse.json();

    if (!customerResponse.ok || customerData.status !== "success") {
      console.error(
        "Flutterwave customer creation error:",
        customerResponse.status,
        customerData,
      );

      return res.status(400).json({
        success: false,
        message:
          customerData.message ||
          customerData.error?.message ||
          "Unable to create Flutterwave customer.",
        flutterwaveStatus: customerData.status || "unknown",
        httpStatus: customerResponse.status,
      });
    }

    const customer = customerData.data;

    return res.status(200).json({
      success: true,
      message: "Flutterwave customer created successfully.",
      customerId: customer.id,
      amount: Number(amount),
      currency,
      courseId,
      courseTitle,
      userId,
    });
  } catch (error) {
    console.error("Create payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment initialization failed.",
    });
  }
}
