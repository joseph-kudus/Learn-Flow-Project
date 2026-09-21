export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required.",
      });
    }

    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      console.error("Flutterwave verification error:", data);

      return res.status(400).json({
        success: false,
        message: data.message || "Unable to verify payment.",
      });
    }

    const transaction = data.data;

    return res.status(200).json({
      success: true,
      payment: {
        id: transaction.id,
        status: transaction.status,
        txRef: transaction.tx_ref,
        amount: transaction.amount,
        currency: transaction.currency,
      },
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
}
