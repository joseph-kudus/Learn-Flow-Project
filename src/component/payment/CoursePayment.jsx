import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const MOBILE_MONEY_OPTIONS = {
  UG: {
    name: "Uganda",
    currency: "UGX",
    countryCode: "256",
    networks: ["MTN", "AIRTEL"],
  },

  GH: {
    name: "Ghana",
    currency: "GHS",
    countryCode: "233",
    networks: ["MTN", "AIRTELTIGO", "TELECEL"],
  },

  KE: {
    name: "Kenya",
    currency: "KES",
    countryCode: "254",
    networks: ["MPS"],
  },

  RW: {
    name: "Rwanda",
    currency: "RWF",
    countryCode: "250",
    networks: ["MTN", "MPS"],
  },

  TZ: {
    name: "Tanzania",
    currency: "TZS",
    countryCode: "255",
    networks: ["AIRTEL", "HALOPESA", "TIGO", "VODACOM"],
  },

  ZM: {
    name: "Zambia",
    currency: "ZMW",
    countryCode: "260",
    networks: ["MPS"],
  },

  CM: {
    name: "Cameroon",
    currency: "XAF",
    countryCode: "237",
    networks: ["MTN", "ORANGEMONEY"],
  },

  CI: {
    name: "Côte d'Ivoire",
    currency: "XOF",
    countryCode: "225",
    networks: ["MOOV", "MTN", "ORANGE", "WAVE"],
  },

  SN: {
    name: "Senegal",
    currency: "XOF",
    countryCode: "221",
    networks: ["ORANGEMONEY", "WAVE"],
  },

  SP: {
    name: "South Sudan",
    currency: "SSP",
    countryCode: "211",
    networks: ["MTN", "ZAIN", "DIGITEL"],
  },
};

const PENDING_PAYMENT_KEY = "learnflow_pending_payment";

const CoursePayment = ({
  courseId,
  courseTitle,
  amount,
  currency = "USD",
  onSuccess,
}) => {
  const { currentUser, userData } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [mobileMoneyCountry, setMobileMoneyCountry] = useState("");
  const [mobileMoneyNetwork, setMobileMoneyNetwork] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [pendingPayment, setPendingPayment] = useState(null);

  const selectedMobileMoney = MOBILE_MONEY_OPTIONS[mobileMoneyCountry] || null;

  const handleCountryChange = (e) => {
    const country = e.target.value;

    setMobileMoneyCountry(country);
    setMobileMoneyNetwork("");
  };

  /* ======================================================
     LOAD STORED PAYMENT
  ====================================================== */

  useEffect(() => {
    const loadPendingPayment = () => {
      try {
        const storedPayment = sessionStorage.getItem(PENDING_PAYMENT_KEY);

        if (!storedPayment) {
          setPendingPayment(null);
          return null;
        }

        const paymentData = JSON.parse(storedPayment);

        setPendingPayment(paymentData);

        return paymentData;
      } catch (error) {
        console.error("Unable to load pending payment:", error);

        sessionStorage.removeItem(PENDING_PAYMENT_KEY);
        setPendingPayment(null);

        return null;
      }
    };

    loadPendingPayment();
  }, []);

  /* ======================================================
     VERIFY PAYMENT
  ====================================================== */

  const verifyPayment = async (paymentData) => {
    if (!paymentData?.chargeId) {
      throw new Error("Flutterwave did not return a charge ID.");
    }

    if (!paymentData?.reference) {
      throw new Error("Flutterwave did not return a payment reference.");
    }

    if (!paymentData?.amountLocal) {
      throw new Error("Flutterwave did not return the local payment amount.");
    }

    if (!paymentData?.currency) {
      throw new Error("Flutterwave did not return the payment currency.");
    }

    console.log("VERIFYING PAYMENT:", {
      chargeId: paymentData.chargeId,
      reference: paymentData.reference,
      amount: paymentData.amountLocal,
      currency: paymentData.currency,
    });

    const response = await fetch("/api/payments/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chargeId: paymentData.chargeId,
        reference: paymentData.reference,
        expectedAmount: paymentData.amountLocal,
        expectedCurrency: paymentData.currency,
      }),
    });

    const responseText = await response.text();

    console.log("VERIFY STATUS:", response.status);

    console.log("VERIFY RAW RESPONSE:", responseText);

    let data = null;

    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch (parseError) {
      console.error("VERIFY JSON PARSE ERROR:", parseError);

      throw new Error("Payment verification returned invalid JSON.");
    }

    console.log("VERIFY RESULT:", data);

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `Payment verification failed with status ${response.status}.`,
      );
    }

    return data;
  };

  /* ======================================================
     COMPLETE VERIFIED PAYMENT
  ====================================================== */

  const handleVerifiedPayment = (verification) => {
    console.log("PAYMENT VERIFIED SUCCESSFULLY:", verification);

    sessionStorage.removeItem(PENDING_PAYMENT_KEY);

    setPendingPayment(null);
    setError("");

    if (onSuccess) {
      onSuccess(verification);
    }
  };

  /* ======================================================
     CHECK PENDING PAYMENT
  ====================================================== */

  const checkPendingPayment = async (showMessage = true) => {
    try {
      const storedPayment = sessionStorage.getItem(PENDING_PAYMENT_KEY);

      if (!storedPayment) {
        setPendingPayment(null);
        return;
      }

      const paymentData = JSON.parse(storedPayment);

      setPendingPayment(paymentData);

      console.log("CHECKING STORED PAYMENT:", paymentData);

      if (showMessage) {
        setError("Checking your payment status...");
      }

      const verification = await verifyPayment(paymentData);

      if (verification?.success && verification?.verified) {
        handleVerifiedPayment(verification);

        return;
      }

      if (verification?.status === "pending") {
        if (showMessage) {
          setError("Payment is still being confirmed. Please wait a moment.");
        }

        return;
      }

      throw new Error(
        verification?.message || "Payment has not been completed.",
      );
    } catch (error) {
      console.error("Pending payment verification error:", error);

      if (showMessage) {
        setError(error.message || "Unable to verify your payment.");
      }
    }
  };

  /* ======================================================
     AUTOMATIC PAYMENT CHECK AFTER RETURN
  ====================================================== */

  useEffect(() => {
    let verificationInProgress = false;

    const checkWhenUserReturns = async () => {
      if (verificationInProgress) {
        return;
      }

      const storedPayment = sessionStorage.getItem(PENDING_PAYMENT_KEY);

      if (!storedPayment) {
        return;
      }

      verificationInProgress = true;

      try {
        console.log("USER RETURNED TO LEARNFLOW - CHECKING PAYMENT");

        setLoading(true);
        setError("Checking your payment status...");

        const paymentData = JSON.parse(storedPayment);

        setPendingPayment(paymentData);

        /*
          Flutterwave may need a short moment
          to update the charge after the sandbox
          authorization succeeds.
        */

        const MAX_ATTEMPTS = 10;
        const POLLING_INTERVAL = 2000;

        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
          console.log(
            `AUTOMATIC PAYMENT VERIFICATION ATTEMPT ${attempt}/${MAX_ATTEMPTS}`,
          );

          const verification = await verifyPayment(paymentData);

          if (verification?.success && verification?.verified) {
            handleVerifiedPayment(verification);

            return;
          }

          if (verification?.status !== "pending") {
            throw new Error(
              verification?.message || "Payment has not been completed.",
            );
          }

          if (attempt < MAX_ATTEMPTS) {
            console.log(
              "Payment still pending. Waiting before checking again...",
            );

            await new Promise((resolve) =>
              setTimeout(resolve, POLLING_INTERVAL),
            );
          }
        }

        setError(
          "Your payment was completed, but Flutterwave is still confirming it. Click Check Payment Status to try again.",
        );
      } catch (error) {
        console.error("Automatic payment verification error:", error);

        setError(error.message || "Unable to verify your payment.");
      } finally {
        verificationInProgress = false;
        setLoading(false);
      }
    };

    /*
      Fires when the user switches back from
      the Flutterwave tab to LearnFlow.
    */

    const handleWindowFocus = () => {
      checkWhenUserReturns();
    };

    /*
      Also catches browser tab visibility changes.
    */

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkWhenUserReturns();
      }
    };

    window.addEventListener("focus", handleWindowFocus);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    /*
      Check once when the component loads.
      This also handles cases where the user
      refreshes LearnFlow after payment.
    */

    checkWhenUserReturns();

    return () => {
      window.removeEventListener("focus", handleWindowFocus);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  /* ======================================================
     HANDLE PAYMENT
  ====================================================== */

  const handlePayment = async () => {
    try {
      setError("");

      if (!currentUser) {
        setError("Please log in to continue.");
        return;
      }

      if (!courseId || !courseTitle || !amount) {
        setError("Course payment information is incomplete.");
        return;
      }

      const cleanedPhoneNumber = phoneNumber.replace(/\s+/g, "");

      if (paymentMethod === "mobile_money") {
        if (!mobileMoneyCountry) {
          setError("Please select your mobile money country.");
          return;
        }

        if (!mobileMoneyNetwork) {
          setError("Please select your mobile money network.");
          return;
        }

        if (!cleanedPhoneNumber) {
          setError("Please enter your mobile money phone number.");
          return;
        }
      }

      setLoading(true);

      const email = currentUser.email;

      const name =
        userData?.username ||
        userData?.displayName ||
        currentUser.displayName ||
        email?.split("@")[0];

      const paymentRequest = {
        amount: Number(amount),
        currency,
        email,
        name,

        paymentMethod,

        ...(paymentMethod === "mobile_money" && {
          phoneNumber: cleanedPhoneNumber,
          mobileMoneyCountry,
          mobileMoneyNetwork,
          mobileMoneyCurrency: selectedMobileMoney?.currency,
          mobileMoneyCountryCode: selectedMobileMoney?.countryCode,
        }),

        courseId,
        courseTitle,
        userId: currentUser.uid,
      };

      console.log("PAYMENT REQUEST:", paymentRequest);

      /* ======================================================
         1. INITIALIZE PAYMENT
      ====================================================== */

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
      });

      const responseText = await response.text();

      console.log("PAYMENT STATUS:", response.status);

      console.log("PAYMENT RAW RESPONSE:", responseText);

      let data = null;

      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (parseError) {
        console.error("PAYMENT JSON PARSE ERROR:", parseError);

        throw new Error(
          `Payment API returned invalid JSON. Status: ${response.status}`,
        );
      }

      if (!response.ok || !data?.success) {
        console.error("PAYMENT API ERROR:", {
          status: response.status,
          data,
        });

        throw new Error(
          data?.message ||
            data?.error ||
            `Payment API failed with status ${response.status}.`,
        );
      }

      console.log("PAYMENT INITIALIZED:", data);

      /* ======================================================
         2. SANDBOX REDIRECT AUTHORIZATION
      ====================================================== */

      if (paymentMethod === "mobile_money" && data?.redirectUrl) {
        console.log(
          "REDIRECTING TO FLUTTERWAVE SANDBOX AUTHORIZATION:",
          data.redirectUrl,
        );

        /*
          Save the payment before leaving
          LearnFlow.

          This is important because the
          payment information is needed when
          the user returns from Flutterwave.
        */

        sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(data));

        setPendingPayment(data);

        /*
          Redirect the current tab to Flutterwave.

          Using location.href instead of
          window.open prevents browser popup
          blocking and means the student
          never needs to find the payment
          URL in the console.
        */

        window.location.href = data.redirectUrl;

        return;
      }

      /* ======================================================
         3. FALLBACK
      ====================================================== */

      throw new Error(
        "Flutterwave did not return a sandbox authorization URL.",
      );
    } catch (error) {
      console.error("Course payment error:", error);

      setError(
        error.message || "Something went wrong while processing your payment.",
      );

      setLoading(false);
    }
  };

  /* ======================================================
     RETURN
  ====================================================== */

  return (
    <div className="course-payment">
      {error && <p className="course-payment-error">{error}</p>}

      <div className="payment-method">
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={loading}
          />
          Card
        </label>

        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="mobile_money"
            checked={paymentMethod === "mobile_money"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={loading}
          />
          Mobile Money
        </label>
      </div>

      {paymentMethod === "mobile_money" && (
        <>
          <select
            value={mobileMoneyCountry}
            onChange={handleCountryChange}
            disabled={loading}
          >
            <option value="">Select country</option>

            {Object.entries(MOBILE_MONEY_OPTIONS).map(
              ([countryCode, country]) => (
                <option key={countryCode} value={countryCode}>
                  {country.name}
                </option>
              ),
            )}
          </select>

          <select
            value={mobileMoneyNetwork}
            onChange={(e) => setMobileMoneyNetwork(e.target.value)}
            disabled={loading || !mobileMoneyCountry}
          >
            <option value="">Select network</option>

            {selectedMobileMoney?.networks.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>

          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter mobile money phone number"
            disabled={loading}
          />
        </>
      )}

      <button type="button" onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : `Pay ${currency} ${amount}`}
      </button>

      {pendingPayment && (
        <button
          type="button"
          onClick={() => checkPendingPayment(true)}
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Payment Status"}
        </button>
      )}
    </div>
  );
};

export default CoursePayment;
