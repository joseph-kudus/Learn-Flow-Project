import crypto from "crypto";
import { getUsdToCurrencyRate } from "./currency/exchange-rate.js";

/* ======================================================
   SUPPORTED MOBILE MONEY OPTIONS
====================================================== */

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
    network: ["MTN", "ZAIN", "DIGITEL"],
  },
};

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
      phoneNumber,
      paymentMethod,
      mobileMoneyCountry,
      mobileMoneyNetwork,
      courseId,
      courseTitle,
      userId,
    } = req.body;

    /* ======================================================
       1. BASIC VALIDATION
    ====================================================== */

    if (
      !amount ||
      !currency ||
      !email ||
      !name ||
      !courseId ||
      !courseTitle ||
      !userId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment information.",
      });
    }

    /* ======================================================
       2. VALIDATE PAYMENT METHOD
    ====================================================== */

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required.",
      });
    }

    /*
      Card is not implemented yet because the current
      frontend does not provide Flutterwave card payment
      details.
    */

    if (paymentMethod === "card") {
      return res.status(400).json({
        success: false,
        message:
          "Card payment is not configured yet. Please select Mobile Money.",
      });
    }

    if (paymentMethod !== "mobile_money") {
      return res.status(400).json({
        success: false,
        message: "Unsupported payment method.",
      });
    }

    /* ======================================================
       3. VALIDATE MOBILE MONEY INFORMATION
    ====================================================== */

    if (!phoneNumber || !mobileMoneyCountry || !mobileMoneyNetwork) {
      return res.status(400).json({
        success: false,
        message:
          "Mobile money country, network, and phone number are required.",
      });
    }

    const countryKey = String(mobileMoneyCountry).trim().toUpperCase();

    const mobileMoneyConfig = MOBILE_MONEY_OPTIONS[countryKey];

    if (!mobileMoneyConfig) {
      return res.status(400).json({
        success: false,
        message: "Unsupported mobile money country.",
      });
    }

    const network = String(mobileMoneyNetwork).trim().toUpperCase();

    if (!mobileMoneyConfig.networks.includes(network)) {
      return res.status(400).json({
        success: false,
        message:
          "The selected mobile money network is not supported for this country.",
      });
    }

    const localCurrency = mobileMoneyConfig.currency;
    const countryCode = mobileMoneyConfig.countryCode;

    const cleanedPhoneNumber = String(phoneNumber).replace(/\s+/g, "").trim();

    /* ======================================================
       4. CONVERT USD → LOCAL CURRENCY
    ====================================================== */

    const usdAmount = Number(amount);

    if (!Number.isFinite(usdAmount) || usdAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount.",
      });
    }

    const exchangeRate = await getUsdToCurrencyRate(localCurrency);

    const localAmount = Math.round(usdAmount * exchangeRate);

    console.log("Currency conversion:", {
      usdAmount,
      exchangeRate,
      localAmount,
      currency: localCurrency,
      country: countryKey,
      network,
    });

    /* ======================================================
       5. GET FLUTTERWAVE ACCESS TOKEN
    ====================================================== */

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

      return res.status(500).json({
        success: false,
        message: "Unable to authenticate with Flutterwave.",
      });
    }

    const accessToken = tokenData.access_token;

    /* ======================================================
       6. FIND OR CREATE CUSTOMER
    ====================================================== */

    const customersResponse = await fetch(
      "https://developersandbox-api.flutterwave.com/customers",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const customersData = await customersResponse.json();

    let customer = customersData?.data?.find(
      (item) => item.email?.toLowerCase() === email.toLowerCase(),
    );

    if (!customer) {
      const nameParts = String(name).trim().split(/\s+/);

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
            name: {
              first: nameParts[0] || name,
              last: nameParts.slice(1).join(" ") || "User",
            },
            email,
          }),
        },
      );

      const customerData = await customerResponse.json();

      if (!customerResponse.ok || !customerData?.data?.id) {
        console.error("Customer creation error:", customerData);

        return res.status(500).json({
          success: false,
          message: "Unable to create Flutterwave customer.",
        });
      }

      customer = customerData.data;
    }

    /* ======================================================
       7. CREATE UNIQUE PAYMENT REFERENCE
    ====================================================== */

    const reference = `LF-${Date.now()}-${crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 8)}`;

    /* ======================================================
       8. CREATE MOBILE MONEY PAYMENT METHOD
    ====================================================== */

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
            country_code: countryCode,
            network,
            phone_number: cleanedPhoneNumber,
          },
        }),
      },
    );

    const paymentMethodData = await paymentMethodResponse.json();

    console.log("Flutterwave payment method:", paymentMethodData);

    if (!paymentMethodResponse.ok || !paymentMethodData?.data?.id) {
      console.error("Payment method creation error:", paymentMethodData);

      return res.status(500).json({
        success: false,
        message: "Unable to create the mobile money payment method.",

        error:
          paymentMethodData?.error?.message ||
          paymentMethodData?.message ||
          "Payment method creation failed.",
      });
    }

    const paymentMethodId = paymentMethodData.data.id;

    /* ======================================================
       9. CREATE FLUTTERWAVE CHARGE
       
       SANDBOX:
       Use redirect authorization instead of the
       default Mobile Money push notification flow.
    ====================================================== */

    const chargeResponse = await fetch(
      "https://developersandbox-api.flutterwave.com/charges",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Trace-Id": crypto.randomUUID(),
          "X-Idempotency-Key": crypto.randomUUID(),

          /*
              Flutterwave Sandbox scenario:
              Mobile Money redirect authorization.
            */
          "X-Scenario-Key": "scenario:auth_redirect",
        },

        body: JSON.stringify({
          amount: localAmount,
          currency: localCurrency,
          customer_id: customer.id,
          payment_method_id: paymentMethodId,
          reference,

          meta: {
            courseId,
            courseTitle,
            userId,

            coursePriceUSD: usdAmount,

            exchangeRate,

            amountLocal: localAmount,

            localCurrency,

            mobileMoneyCountry: countryKey,

            mobileMoneyNetwork: network,
          },
        }),
      },
    );

    const chargeData = await chargeResponse.json();

    console.log("Flutterwave charge response:", chargeData);

    if (!chargeResponse.ok) {
      console.error("Flutterwave charge error:", chargeData);

      return res.status(500).json({
        success: false,
        message: "Unable to initiate the mobile money payment.",

        error:
          chargeData?.error?.message ||
          chargeData?.message ||
          "Flutterwave charge failed.",
      });
    }

    /* ======================================================
       10. GET REDIRECT ACTION
    ====================================================== */

    const nextAction = chargeData?.data?.next_action || null;

    const redirectUrl =
      nextAction?.redirect_url?.url || nextAction?.redirect_url || null;

    console.log("Flutterwave next action:", nextAction);

    console.log("Flutterwave redirect URL:", redirectUrl);

    /* ======================================================
       11. PAYMENT INITIALIZED
    ====================================================== */

    return res.status(200).json({
      success: true,

      message: "Mobile money payment initiated successfully.",

      customerId: customer.id,

      paymentMethodId,

      chargeId: chargeData?.data?.id,

      status: chargeData?.data?.status,

      coursePriceUSD: usdAmount,

      exchangeRate,

      amountLocal: localAmount,

      currency: localCurrency,

      mobileMoneyCountry: countryKey,

      mobileMoneyNetwork: network,

      mobileMoneyCountryCode: countryCode,

      courseId,
      courseTitle,
      userId,

      reference,

      nextAction,

      redirectUrl,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment initialization failed.",
      error: error.message,
    });
  }
}
