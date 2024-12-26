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
    secret: "Secret Key",
  };

  const getCurrentDateTime = () => {
    return "2024-01-01T00:00:00";
  };

  const generateHash = (
    storeId: string,
    dateTime: string,
    amount: string,
    secret: string
  ) => {
    let storeHash = "";

    storeHash += storeId;
    storeHash += dateTime;
    storeHash += amount;
    storeHash += "840"; // Currency code
    storeHash += secret;

    const buf = Buffer.from(storeHash, "ascii").toString("hex");
    return crypto.createHash("sha256").update(buf).digest("hex");
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
    secret: "k8>'QRb9gV",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    const now = new Date();
    const newFormData = {
      ...formData,
      txndatetime: now.toISOString().slice(0, 19),
    };
    setFormData(newFormData);

    // Generate initial hash with secret from form data
    const initialHash = generateHash(
      newFormData.storename,
      newFormData.txndatetime,
      newFormData.chargetotal,
      newFormData.secret
    );
    setCurrentHash(initialHash);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newFormData = { ...formData };

    // Handle chargetotal validation (only numbers and decimal points)
    if (name === "chargetotal") {
      const regex = /^\d*\.?\d{0,2}$/;
      if (value === "" || regex.test(value)) {
        newFormData = {
          ...formData,
          [name]: value,
        };
      } else {
        return;
      }
    } else {
      newFormData = {
        ...formData,
        [name]: value,
      };
    }

    // Update form data
    setFormData(newFormData);

    // Generate and update hash with secret from form data
    const newHash = generateHash(
      newFormData.storename,
      newFormData.txndatetime,
      newFormData.chargetotal,
      newFormData.secret
    );
    setCurrentHash(newHash);
  };

  const handleClear = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate hash before submission using secret from form data
    const hash = generateHash(
      formData.storename,
      formData.txndatetime,
      formData.chargetotal,
      formData.secret
    );

    const form = document.createElement("form");
    form.method = "post";
    form.action = "https://www3.ipg-online.com/connect/gateway/processing";
    form.target = "_blank";

    // Add all form fields including the hash
    Object.entries({ ...formData, hash }).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = key === "chargetotal" ? "text" : "hidden";
      input.name = key;
      input.value = value;
      input.readOnly = true;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const hashInfoBox = (
    <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-emerald-500/20">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <svg
            className="w-5 h-5 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-emerald-400">Security Hash</h3>
      </div>

      <div className="space-y-3 text-sm text-slate-300">
        <p>
          A SHA-256 hash will be automatically generated and included with your
          submission. The hash is created using the following fields in order:
        </p>
        <div className="pl-4 border-l-2 border-emerald-500/20">
          <code className="font-mono text-emerald-300">
            storename + txndatetime + chargetotal + currency + secret
          </code>
        </div>
        {currentHash && (
          <div className="mt-4">
            <p className="text-slate-400 mb-2">Current Hash:</p>
            <code className="font-mono text-emerald-300 break-all bg-slate-800/50 p-2 rounded block">
              {currentHash}
            </code>
          </div>
        )}
        <p className="text-slate-400 text-xs">
          This hash ensures the integrity and authenticity of your transaction
          data. The server will validate this hash using the same secret key to
          verify the request.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <main className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
            Payment Gateway
          </h1>
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">Live</span>
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-slate-800 rounded-lg">
              <svg
                className="w-6 h-6 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-200">
                Transaction Details
              </h2>
              <p className="text-slate-400 text-sm">
                Please fill in the payment information below
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(formData).map((field) => (
              <div key={field} className="group">
                <label
                  className="block text-sm font-medium text-slate-300 mb-2"
                  htmlFor={field}
                >
                  {fieldLabels[field]}
                </label>
                <input
                  type={
                    field === "chargetotal" || field === "currency"
                      ? "text"
                      : "text"
                  }
                  id={field}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           transition-all duration-200 ease-in-out
                           hover:bg-slate-900/70"
                  placeholder={
                    field === "chargetotal"
                      ? "Enter Charge Total"
                      : field === "currency"
                      ? "Enter numeric currency code"
                      : `Enter ${fieldLabels[field]}`
                  }
                />
                {field === "chargetotal" && (
                  <span className="text-xs text-slate-400 mt-1 block">
                    Format: 0.00 (max two decimal places)
                  </span>
                )}
                {field === "currency" && (
                  <span className="text-xs text-slate-400 mt-1 block">
                    Numbers only (e.g., 840 for USD)
                  </span>
                )}
              </div>
            ))}
          </div>

          {hashInfoBox}

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 
                       rounded-lg font-medium hover:opacity-90 transition-opacity
                       focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900
                       flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Process Payment
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-slate-800 border border-slate-700 
                       rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              Clear Form
            </button>
          </div>
        </div>

        <div className="mt-8 p-6 bg-slate-800/30 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-emerald-400">
              Form Preview
            </h2>
          </div>
          <pre className="font-mono text-sm text-slate-300 overflow-auto">
            {`<form method="post" action="https://www3.ipg-online.com/connect/gateway/processing" target="_blank">
  <input type="text" name="chargetotal" value="${formData.chargetotal}" readonly />
  <input type="hidden" name="hash_algorithm" value="${formData.hash_algorithm}" readonly />
  <input type="hidden" name="responseFailURL" value="${formData.responseFailURL}" readonly />
  <input type="hidden" name="responseSuccessURL" value="${formData.responseSuccessURL}" readonly />
  <input type="hidden" name="storename" value="${formData.storename}" readonly />
  <input type="hidden" name="timezone" value="${formData.timezone}" readonly />
  <input type="hidden" name="txndatetime" value="${formData.txndatetime}" readonly />
  <input type="hidden" name="txntype" value="${formData.txntype}" readonly />
  <input type="hidden" name="mode" value="${formData.mode}" readonly />
  <input type="hidden" name="oid" value="${formData.oid}" readonly />
  <input type="hidden" name="currency" value="${formData.currency}" readonly />
  <input type="hidden" name="authenticateTransaction" value="${formData.authenticateTransaction}" readonly />
  <input type="hidden" name="assignToken" value="${formData.assignToken}" readonly />
  <input type="hidden" name="checkoutoption" value="${formData.checkoutoption}" readonly /></form>`}
          </pre>
        </div>
      </main>
    </div>
  );
}
