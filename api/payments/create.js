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

    const txRef = `LF-${courseId}-${userId}-${Date.now()}`;

    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: Number(amount),
        currency,

        redirect_url: `${process.env.APP_URL}/#/payment/callback`,

        customer: {
          email,
          name,
        },

        customizations: {
          title: "LearnFlow",
          description: `Payment for ${courseTitle}`,
        },

        meta: {
          userId,
          courseId,
          courseTitle,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      console.error("Flutterwave payment error:", data);

      return res.status(400).json({
        success: false,
        message: data.message || "Unable to create payment.",
      });
    }

    return res.status(200).json({
      success: true,
      paymentLink: data.data.link,
      txRef,
    });
  } catch (error) {
    console.error("Create payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment initialization failed.",
    });
  }
}
