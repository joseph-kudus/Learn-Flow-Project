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
      paymentMethodId,
      courseId = "test-course-1",
      courseTitle = "LearnFlow Test Course",
      userId = "test-user-1",
    } = req.body;

    // ==========================================
    // Validate payment information
    // ==========================================

    if (!customerId || !paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: "Missing customer ID or payment method ID.",
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
    // 2. Create unique payment reference
    // ==========================================

    const reference = `LF-TEST-${Date.now()}`;

    // ==========================================
    // 3. Create Flutterwave sandbox charge
    // ==========================================

    const chargeResponse = await fetch(
      "https://developersandbox-api.flutterwave.com/charges",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Trace-Id": crypto.randomUUID(),
          "X-Idempotency-Key": crypto.randomUUID(),

          // Sandbox authorization simulation
          "X-Scenario-Key": "scenario:auth_redirect",
        },
        body: JSON.stringify({
          amount: Number(amount),
          currency,
          reference,
          customer_id: customerId,
          payment_method_id: paymentMethodId,

          redirect_url: "https://learn-flow-project.vercel.app/#/dashboard",

          meta: {
            userId,
            courseId,
            courseTitle,
          },
        }),
      },
    );

    const chargeData = await chargeResponse.json();

    console.log("Flutterwave charge response:", chargeData);

    if (!chargeResponse.ok) {
      return res.status(chargeResponse.status).json({
        success: false,
        message: chargeData.message || "Unable to create sandbox charge.",
        flutterwaveStatus: chargeData.status || "failed",
        httpStatus: chargeResponse.status,
        data: chargeData.data || null,
      });
    }

    // ==========================================
    // 4. Return charge information
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Sandbox charge created successfully.",
      reference,
      charge: chargeData.data || null,
      courseId,
      courseTitle,
      userId,
    });
  } catch (error) {
    console.error("Sandbox charge error:", error);

    return res.status(500).json({
      success: false,
      message: "Sandbox charge creation failed.",
    });
  }
}
