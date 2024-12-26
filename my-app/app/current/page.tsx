"use client";
import { useState } from "react";

// First, define the type for the form data
type FormData = {
  hash: string;
  chargetotal: number;
  hash_algorithm: string;
  responseFailURL: string;
  responseSuccessURL: string;
  storename: number;
  timezone: string;
  txndatetime: string;
  txntype: string;
  mode: string;
  oid: number;
  authenticateTransaction: string;
  assignToken: string;
  checkoutoption: string;
  currency: number;
};

export default function Home() {
  // Helper to format the current date-time in required format
  const getCurrentDateTime = () => {
    const now = new Date();
    // Ensure two digits for all components
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${now.getFullYear()}:${month}:${day}-${hours}:${minutes}:${seconds}`;
  };

  const initialFormState: FormData = {
    hash: "c0ffca17962ee946f16271f1c7d2c9699a4bd11952cf05263d83a90876ea0adf",
    chargetotal: 25,
    hash_algorithm: "SHA256",
    responseFailURL: "https://fiserv-payment-playground.vercel.app/fail",
    responseSuccessURL: "https://fiserv-payment-playground.vercel.app/success",
    storename: 67984769291886,
    timezone: "Europe/London",
    txndatetime: getCurrentDateTime(),
    txntype: "sale",
    mode: "payonly",
    oid: 1234,
    authenticateTransaction: "true",
    assignToken: "true",
    checkoutoption: "combinedpage",
    currency: 840,
  };

  const [formData, setFormData] = useState(initialFormState);

  // Secret key (kept securely within the code for simulation)
  //const secretKey = "k8>'QRb9gV";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Type guard to ensure name is a valid key of FormData
    if (!Object.keys(formData).includes(name)) return;

    const newFormData = { ...formData };

    // Handle different field types
    switch (name) {
      case "chargetotal":
        const regex = /^\d*\.?\d{0,2}$/;
        if (!regex.test(value)) return;
        newFormData[name] = parseFloat(value) || 0;
        break;

      case "storename":
      case "oid":
      case "currency":
        // Only allow numeric input for these fields
        if (!/^\d*$/.test(value)) return;
        newFormData[name] = parseInt(value) || 0;
        break;

      default:
        // For string fields, directly assign the value
        (newFormData[name as keyof FormData] as string) = value;
    }

    // Update form data and regenerate hash
    setFormData(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Set the hardcoded hash right before submission
    const submissionHash =
      "c0ffca17962ee946f16271f1c7d2c9699a4bd11952cf05263d83a90876ea0adf";

    // Create a form and simulate submission
    const form = document.createElement("form");
    form.method = "post";
    form.action = "https://www3.ipg-online.com/connect/gateway/processing";
    form.target = "_blank";

    // Add all fields to the form, using the hardcoded hash
    Object.entries({ ...formData, hash: submissionHash }).forEach(
      ([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;

        // Convert value based on field type
        switch (key) {
          case "chargetotal":
          case "storename":
          case "oid":
          case "currency":
            input.value = String(value); // Convert number to string but maintain numeric type
            break;
          default:
            input.value = String(value);
        }

        form.appendChild(input);
      }
    );

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 text-transparent bg-clip-text">
          Payment Gateway Simulator
        </h1>

        <div className="mt-8 bg-slate-800/30 p-8 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-6">Transaction Details</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Numeric Inputs */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Charge Total
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="chargetotal"
                  value={formData.chargetotal}
                  onChange={handleChange}
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Store Name
                </label>
                <input
                  type="number"
                  name="storename"
                  value={formData.storename}
                  onChange={handleChange}
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Order ID
                </label>
                <input
                  type="number"
                  name="oid"
                  value={formData.oid}
                  onChange={handleChange}
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Currency
                </label>
                <input
                  type="number"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>

              {/* String Inputs */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Hash Algorithm
                </label>
                <input
                  type="text"
                  name="hash_algorithm"
                  value={formData.hash_algorithm}
                  disabled
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Response Fail URL
                </label>
                <input
                  type="text"
                  name="responseFailURL"
                  value={formData.responseFailURL}
                  onChange={handleChange}
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Response Success URL
                </label>
                <input
                  type="text"
                  name="responseSuccessURL"
                  value={formData.responseSuccessURL}
                  onChange={handleChange}
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Timezone
                </label>
                <input
                  type="text"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Transaction Date Time
                </label>
                <input
                  type="text"
                  name="txndatetime"
                  value={formData.txndatetime}
                  onChange={handleChange}
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Transaction Type
                </label>
                <input
                  type="text"
                  name="txntype"
                  value={formData.txntype}
                  onChange={handleChange}
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Mode
                </label>
                <input
                  type="text"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Authenticate Transaction
                </label>
                <input
                  type="text"
                  name="authenticateTransaction"
                  value={formData.authenticateTransaction}
                  onChange={handleChange}
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Assign Token
                </label>
                <input
                  type="text"
                  name="assignToken"
                  value={formData.assignToken}
                  onChange={handleChange}
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Checkout Option
                </label>
                <input
                  type="text"
                  name="checkoutoption"
                  value={formData.checkoutoption}
                  onChange={handleChange}
                  className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Hash</label>
              <input
                type="text"
                name="hash"
                value={formData.hash}
                disabled
                className="w-full bg-slate-900 p-2 rounded border border-slate-700"
              />
            </div>

            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="bg-emerald-500 px-4 py-2 rounded text-white"
              >
                Simulate Submission
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
