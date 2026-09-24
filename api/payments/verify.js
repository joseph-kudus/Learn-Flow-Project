/* ======================================================
   GET FLUTTERWAVE ACCESS TOKEN
====================================================== */

async function getFlutterwaveAccessToken() {
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

  if (!tokenResponse.ok || !tokenData?.access_token) {
    console.error("Flutterwave token error:", tokenData);

    throw new Error("Unable to authenticate with Flutterwave.");
  }

  return tokenData.access_token;
}

/* ======================================================
   VERIFY PAYMENT
====================================================== */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { chargeId, reference, expectedAmount, expectedCurrency } =
      req.body || {};

    /* ======================================================
       1. VALIDATE REQUEST
    ====================================================== */

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required.",
      });
    }

    if (!expectedAmount || !expectedCurrency) {
      return res.status(400).json({
        success: false,
        message: "Expected payment amount and currency are required.",
      });
    }

    const amount = Number(expectedAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid expected payment amount.",
      });
    }

    const currency = String(expectedCurrency).trim().toUpperCase();

    /* ======================================================
       2. GET FLUTTERWAVE ACCESS TOKEN
    ====================================================== */

    const accessToken = await getFlutterwaveAccessToken();

    /* ======================================================
       3. FIND CHARGE
       
       Prefer chargeId when supplied.
       Otherwise search using the payment reference.
    ====================================================== */

    let chargeResponse;

    if (chargeId) {
      chargeResponse = await fetch(
        `https://developersandbox-api.flutterwave.com/charges/${encodeURIComponent(
          chargeId,
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
    } else {
      chargeResponse = await fetch(
        `https://developersandbox-api.flutterwave.com/charges?reference=${encodeURIComponent(
          reference,
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const responseText = await chargeResponse.text();

    let chargeData;

    try {
      chargeData = JSON.parse(responseText);
    } catch {
      console.error("Flutterwave returned non-JSON response:", responseText);

      return res.status(502).json({
        success: false,
        message: "Flutterwave returned an invalid response.",
      });
    }

    console.log("Flutterwave verification response:", chargeData);

    /* ======================================================
       4. HANDLE FLUTTERWAVE ERROR
    ====================================================== */

    if (!chargeResponse.ok) {
      console.error("Flutterwave charge verification error:", chargeData);

      return res.status(chargeResponse.status || 500).json({
        success: false,
        message: "Unable to retrieve payment information from Flutterwave.",
        error:
          chargeData?.error?.message ||
          chargeData?.message ||
          chargeData?.error ||
          "Payment verification failed.",
      });
    }

    /* ======================================================
       5. EXTRACT CHARGE
    ====================================================== */

    let charge = null;

    if (chargeId) {
      charge = chargeData?.data || null;
    } else {
      if (Array.isArray(chargeData?.data)) {
        charge = chargeData.data.find((item) => item?.reference === reference);
      } else if (chargeData?.data?.reference === reference) {
        charge = chargeData.data;
      }
    }

    if (!charge) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: "Payment transaction could not be found.",
        reference,
      });
    }

    /* ======================================================
       6. VERIFY PAYMENT REFERENCE
    ====================================================== */

    if (charge.reference !== reference) {
      console.error("Payment reference mismatch:", {
        expected: reference,
        received: charge.reference,
      });

      return res.status(400).json({
        success: false,
        verified: false,
        message: "Payment reference does not match.",
      });
    }

    /* ======================================================
       7. VERIFY PAYMENT CURRENCY
    ====================================================== */

    const receivedCurrency = String(charge.currency || "")
      .trim()
      .toUpperCase();

    if (receivedCurrency !== currency) {
      console.error("Payment currency mismatch:", {
        expected: currency,
        received: receivedCurrency,
      });

      return res.status(400).json({
        success: false,
        verified: false,
        message: "Payment currency does not match the expected currency.",
        expectedCurrency: currency,
        receivedCurrency,
      });
    }

    /* ======================================================
       8. VERIFY PAYMENT AMOUNT
    ====================================================== */

    const paidAmount = Number(charge.amount);

    if (!Number.isFinite(paidAmount)) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "Flutterwave returned an invalid payment amount.",
      });
    }

    if (paidAmount < amount) {
      console.error("Payment amount mismatch:", {
        expected: amount,
        received: paidAmount,
      });

      return res.status(400).json({
        success: false,
        verified: false,
        message: "The payment amount is less than the required course price.",
        paymentStatus: charge.status,
        expectedAmount: amount,
        paidAmount,
        currency: receivedCurrency,
      });
    }

    /* ======================================================
       9. CHECK PAYMENT STATUS
    ====================================================== */

    const paymentStatus = String(charge.status || "").toLowerCase();

    console.log("PAYMENT STATUS FROM FLUTTERWAVE:", paymentStatus);

    /* ======================================================
       10. PAYMENT STILL PENDING
    ====================================================== */

    if (paymentStatus !== "succeeded") {
      return res.status(200).json({
        success: false,
        verified: false,

        message:
          paymentStatus === "pending"
            ? "Payment is still pending. Please complete the payment authorization."
            : "Payment has not been completed.",

        status: paymentStatus,

        chargeId: charge.id || chargeId || null,

        reference: charge.reference || reference,

        amount: paidAmount,

        currency: receivedCurrency,

        nextAction: charge.next_action || null,
      });
    }

    /* ======================================================
       11. PAYMENT VERIFIED SUCCESSFULLY
    ====================================================== */

    console.log("PAYMENT VERIFIED SUCCESSFULLY:", {
      chargeId: charge.id || chargeId,
      reference: charge.reference,
      amount: paidAmount,
      currency: receivedCurrency,
      status: paymentStatus,
    });

    return res.status(200).json({
      success: true,
      verified: true,

      message: "Payment verified successfully.",

      chargeId: charge.id || chargeId,

      reference: charge.reference,

      status: paymentStatus,

      amount: paidAmount,

      currency: receivedCurrency,

      customer: charge.customer || null,

      paymentMethod: charge.payment_method_details || null,

      meta: charge.meta || {},
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      verified: false,
      message: "Payment verification failed.",
      error: error.message,
    });
  }
}
