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
      customerId,
      courseId,
      courseTitle,
      userId,
    } = req.body;

    if (!amount || !customerId || !courseId || !courseTitle || !userId) {
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
    // 2. Create unique transaction reference
    // ==========================================

    const reference = `LF-${Date.now()}`;

    // ==========================================
    // 3. Create sandbox charge
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

          // Sandbox successful authentication scenario
          "X-Scenario-Key": "scenario:auth_3ds&issuer:approved",
        },
        body: JSON.stringify({
          amount: Number(amount),
          currency,
          reference,

          // This must be an existing Flutterwave payment method.
          payment_method_id: "REPLACE_WITH_TEST_PAYMENT_METHOD_ID",

          customer_id: customerId,

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
        message:
          chargeData.message || "Unable to initialize Flutterwave payment.",
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
      message: "Sandbox payment initialized.",
      reference,
      charge: chargeData.data || null,
      courseId,
      courseTitle,
      userId,
    });
  } catch (error) {
    console.error("Test charge error:", error);

    return res.status(500).json({
      success: false,
      message: "Sandbox payment initialization failed.",
    });
  }
}
