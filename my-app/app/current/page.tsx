"use client";
import { useState, useEffect } from "react";
import crypto from "crypto";

export default function Home() {
  const fieldLabels: { [key: string]: string } = {
    chargetotal: "Charge Total",
    hash_algorithm: "Hash Algorithm",
    responseFailURL: "Response Fail URL",
    responseSuccessURL: "Response Success URL",
    storename: "Store Name",
    timezone: "Timezone",
    txndatetime: "Transaction Date Time",
    txntype: "Transaction Type",
    mode: "Mode",
    oid: "Order ID",
    authenticateTransaction: "Authenticate Transaction",
    assignToken: "Assign Token",
    checkoutoption: "Checkout Option",
    currency: "Currency",
  };

  // Helper to format the current date-time in required format
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace("T", " "); // Example: 2024-01-01 00:00:00
  };

  // Function to generate the SHA-256 hash
  const generateHash = (
    storeId: string,
    dateTime: string,
    amount: string,
    secret: string
  ) => {
    const storeHash = storeId + dateTime + amount + "840" + secret; // Currency code is hardcoded as "840"
    return crypto.createHash("sha256").update(storeHash).digest("hex");
  };

  const initialFormState = {
    chargetotal: "1.00",
    hash_algorithm: "SHA256",
    responseFailURL: "https://fiserv-payment-playground.vercel.app/fail",
    responseSuccessURL: "https://fiserv-payment-playground.vercel.app/success",
    storename: "67984769291886",
    timezone: "Europe/London",
    txndatetime: getCurrentDateTime(),
    txntype: "sale",
    mode: "payonly",
    oid: "test-order-123",
    authenticateTransaction: "true",
    assignToken: "true",
    checkoutoption: "combinedpage",
    currency: "840",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [currentHash, setCurrentHash] = useState("");

  // Secret key (kept securely within the code for simulation)
  const secretKey = "k8>'QRb9gV";

  useEffect(() => {
    // Generate hash on mount with initial form data
    const initialHash = generateHash(
      formData.storename,
      formData.txndatetime,
      formData.chargetotal,
      secretKey
    );
    setCurrentHash(initialHash);
  }, [formData.storename, formData.txndatetime, formData.chargetotal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData };

    // Validate chargetotal (only numeric + decimal values)
    if (name === "chargetotal") {
      const regex = /^\d*\.?\d{0,2}$/;
      if (!regex.test(value)) return; // Prevent invalid inputs
    }

    newFormData[name as keyof typeof formData] = value;

    // Update form data and regenerate hash
    setFormData(newFormData);

    const newHash = generateHash(
      newFormData.storename,
      newFormData.txndatetime,
      newFormData.chargetotal,
      secretKey
    );
    setCurrentHash(newHash);
  };

  const handleClear = () => {
    const resetForm = {
      ...initialFormState,
      txndatetime: getCurrentDateTime(),
    };
    setFormData(resetForm);

    // Regenerate hash for reset data
    const resetHash = generateHash(
      resetForm.storename,
      resetForm.txndatetime,
      resetForm.chargetotal,
      secretKey
    );
    setCurrentHash(resetHash);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a form and simulate submission
    const form = document.createElement("form");
    form.method = "post";
    form.action = "https://www3.ipg-online.com/connect/gateway/processing";
    form.target = "_blank";

    // Add all fields to the form
    Object.entries({ ...formData, hash: currentHash }).forEach(
      ([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
    );

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const hashInfoBox = (
    <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-emerald-500/20">
      <h3 className="text-lg font-medium text-emerald-400 mb-3">
        Security Hash (Simulated)
      </h3>
      <div className="text-sm text-slate-300 space-y-3">
        <p>The following hash is dynamically generated for the simulation:</p>
        <code className="block p-2 bg-slate-900 rounded text-emerald-300">
          {currentHash}
        </code>
        <p className="text-xs text-slate-500">
          Formula:{" "}
          <code className="font-mono">
            storename + txndatetime + chargetotal + currency + secret
          </code>
        </p>
      </div>
    </div>
  );

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
              {Object.entries(fieldLabels).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm text-slate-400 mb-2">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key as keyof typeof formData] || ""}
                    onChange={handleChange}
                    className="w-full bg-slate-900 p-2 rounded border border-slate-700"
                    disabled={key === "hash_algorithm"}
                  />
                </div>
              ))}
            </div>

            {hashInfoBox}

            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="bg-emerald-500 px-4 py-2 rounded text-white"
              >
                Simulate Submission
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-slate-700 px-4 py-2 rounded text-white"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
