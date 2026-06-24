export type PaymentMethod = "paypal" | "bank_transfer";

export function getPaymentConfig() {
  return {
    paypalPaymentLink: process.env.PAYPAL_PAYMENT_LINK || "",
    paypalEmail: process.env.PAYPAL_EMAIL || "payments@avoryne.com",
    bankAccountName: process.env.BANK_ACCOUNT_NAME || "Avoryne Jewelry",
    bankName: process.env.BANK_NAME || "Your bank name",
    bankAccountNumber: process.env.BANK_ACCOUNT_NUMBER || "Add before launch",
    bankSwift: process.env.BANK_SWIFT || "Add before launch",
    bankIban: process.env.BANK_IBAN || "",
    bankAddress: process.env.BANK_ADDRESS || "",
  };
}

export function getPaymentLabel(method: string) {
  if (method === "paypal") return "PayPal";
  if (method === "bank_transfer") return "Bank transfer";
  return method;
}
