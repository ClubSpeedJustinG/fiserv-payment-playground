"use client";
import { useState } from "react";
import crypto from "crypto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle, X } from "lucide-react";

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
  secretkey: string;
};

// Add help content
const helpContent = {
  storename: "This should be the control panel setting FirstDataIPGVenueStore.",
  orderId: "This should be the checkId.",
  currency: "Currency code (e.g., 840 for USD)",
  secretKey:
    "This should the be the control panel setting FirstDataIPGVenueSharedSecret.",
};

// Common input class for all text inputs
const inputClass =
  "w-full bg-slate-900 p-2 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors";

// Common select trigger class for all select components
const selectTriggerClass =
  "w-full bg-slate-900 border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors";

export default function Home() {
  const initialFormState: FormData = {
    txndatetime: "",
    hash: "",
    chargetotal: 25,
    hash_algorithm: "SHA256",
    responseFailURL: "https://fiserv-payment-playground.vercel.app/fail",
    responseSuccessURL: "https://fiserv-payment-playground.vercel.app/success",
    storename: 67984769291886,
    timezone: "Europe/London",
    txntype: "sale",
    mode: "payonly",
    oid: 32,
    authenticateTransaction: "true",
    assignToken: "true",
    checkoutoption: "combinedpage",
    currency: 840,
    secretkey: "k8>'QRb9gV",
  };

  // Add these option configurations
  const dropdownOptions = {
    timezone: ["Europe/London"],
    txntype: ["sale"],
    mode: ["payonly"],
    authenticateTransaction: ["true"],
    assignToken: ["true"],
    checkoutoption: ["combinedpage"],
    hash_algorithm: ["SHA256"],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFormData, setPreviewFormData] = useState<FormData | null>(null);

  // Add this function to generate hash
  const generateHash = (data: FormData) => {
    let storeHash = "";
    // Concatenate in exact order
    storeHash += data.storename;
    storeHash += data.txndatetime;
    storeHash += data.chargetotal;
    storeHash += data.currency;
    storeHash += data.secretkey; // Secret key

    // Convert to hex and create SHA-256 hash
    const buf = Buffer.from(storeHash, "ascii").toString("hex");
    return crypto.createHash("sha256").update(buf).digest("hex");
  };

  // Update handleChange to handle shadcn select
  const handleChange = (name: keyof FormData, value: string) => {
    if (!Object.keys(formData).includes(name)) return;

    const newFormData = { ...formData };
    (newFormData[name] as string | number) = value;
    setFormData(newFormData);
  };

  function getFormattedDate() {
    const now = new Date();
    now.setDate(now.getDate() + 1); // Add one day
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}:${month}:${date}-${hours}:${minutes}:${seconds}`;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors: string[] = [];

    if (!/^\d+$/.test(String(formData.chargetotal))) {
      validationErrors.push("Charge Total must be a valid number");
    }
    if (!/^\d+$/.test(String(formData.storename))) {
      validationErrors.push("Store Name must be a valid number");
    }
    if (!/^\d+$/.test(String(formData.oid))) {
      validationErrors.push("Order ID must be a valid number");
    }
    if (!/^\d+$/.test(String(formData.currency))) {
      validationErrors.push("Currency must be a valid number");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formattedDate = getFormattedDate();
    const formDataToSend = {
      ...formData,
      txndatetime: formattedDate,
      hash: generateHash({ ...formData, txndatetime: formattedDate }),
    };

    setPreviewFormData(formDataToSend);
    setShowPreview(true);
  };

  const handleFinalSubmit = () => {
    if (!previewFormData) return;

    const form = document.createElement("form");
    form.method = "post";
    form.action = "https://www3.ipg-online.com/connect/gateway/processing";
    form.target = "_blank";

    Object.entries(previewFormData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <main className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
            IPG Payment Gateway Simulator
          </h1>
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">Live</span>
          </div>
        </div>

        {!showPreview ? (
          // Transaction Details Section
          <div
            className="mt-8 bg-slate-800/30 p-8 rounded-2xl border border-slate-700 shadow-xl 
            hover:scale-[1.01] hover:border-emerald-500/50 hover:shadow-emerald-500/20 hover:shadow-2xl 
            transition-all duration-300 ease-out"
          >
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <h3 className="text-red-400 font-semibold mb-2">
                  Please correct the following errors:
                </h3>
                <ul className="list-disc list-inside text-red-300">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <h2 className="text-xl font-semibold mb-6 text-slate-200">
              Test Transaction
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Numeric Inputs */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Charge Total
                  </label>
                  <input
                    type="text"
                    name="chargetotal"
                    value={formData.chargetotal}
                    onChange={(e) =>
                      handleChange("chargetotal", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
                    Store Name
                    <Dialog>
                      <DialogTrigger>
                        <HelpCircle className="h-4 w-4 text-slate-400 hover:text-blue-400" />
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-800">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-semibold text-white">
                            Store Name
                          </DialogTitle>
                        </DialogHeader>
                        <div className="text-slate-300 mt-2">
                          {helpContent.storename}
                        </div>
                        <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-white">
                          <X className="h-4 w-4 text-white" />
                          <span className="sr-only">Close</span>
                        </button>
                      </DialogContent>
                    </Dialog>
                  </label>
                  <input
                    type="text"
                    name="storename"
                    value={formData.storename}
                    onChange={(e) => handleChange("storename", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
                    Order ID
                    <Dialog>
                      <DialogTrigger>
                        <HelpCircle className="h-4 w-4 text-slate-400 hover:text-blue-400" />
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-800">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-semibold text-white">
                            Order ID
                          </DialogTitle>
                        </DialogHeader>
                        <div className="text-slate-300 mt-2">
                          {helpContent.orderId}
                        </div>
                        <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-white">
                          <X className="h-4 w-4 text-white" />
                          <span className="sr-only">Close</span>
                        </button>
                      </DialogContent>
                    </Dialog>
                  </label>
                  <input
                    type="text"
                    name="oid"
                    value={formData.oid}
                    onChange={(e) => handleChange("oid", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
                    Currency
                    <Dialog>
                      <DialogTrigger>
                        <HelpCircle className="h-4 w-4 text-slate-400 hover:text-blue-400" />
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-800">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-semibold text-white">
                            Currency
                          </DialogTitle>
                        </DialogHeader>
                        <div className="text-slate-300 mt-2">
                          {helpContent.currency}
                        </div>
                        <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-white">
                          <X className="h-4 w-4 text-white" />
                          <span className="sr-only">Close</span>
                        </button>
                      </DialogContent>
                    </Dialog>
                  </label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* String Inputs */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Hash Algorithm
                  </label>
                  <Select
                    name="hash_algorithm"
                    value={formData.hash_algorithm}
                    onValueChange={(value) =>
                      handleChange("hash_algorithm", value)
                    }
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Select hash algorithm" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {dropdownOptions.hash_algorithm.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Response Fail URL
                  </label>
                  <input
                    type="text"
                    name="responseFailURL"
                    value={formData.responseFailURL}
                    onChange={(e) =>
                      handleChange("responseFailURL", e.target.value)
                    }
                    className={inputClass}
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
                    onChange={(e) =>
                      handleChange("responseSuccessURL", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Timezone
                  </label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => handleChange("timezone", value)}
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {dropdownOptions.timezone.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Transaction Type
                  </label>
                  <Select
                    value={formData.txntype}
                    onValueChange={(value) => handleChange("txntype", value)}
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {dropdownOptions.txntype.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Mode
                  </label>
                  <Select
                    value={formData.mode}
                    onValueChange={(value) => handleChange("mode", value)}
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {dropdownOptions.mode.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Authenticate Transaction
                  </label>
                  <Select
                    value={formData.authenticateTransaction}
                    onValueChange={(value) =>
                      handleChange("authenticateTransaction", value)
                    }
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Select authentication" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {dropdownOptions.authenticateTransaction.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Assign Token
                  </label>
                  <Select
                    value={formData.assignToken}
                    onValueChange={(value) =>
                      handleChange("assignToken", value)
                    }
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Select token assignment" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {dropdownOptions.assignToken.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Checkout Option
                  </label>
                  <Select
                    value={formData.checkoutoption}
                    onValueChange={(value) =>
                      handleChange("checkoutoption", value)
                    }
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Select checkout option" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {dropdownOptions.checkoutoption.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
                    Secret Key
                    <Dialog>
                      <DialogTrigger>
                        <HelpCircle className="h-4 w-4 text-slate-400 hover:text-blue-400" />
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-800">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-semibold text-white">
                            Secret Key
                          </DialogTitle>
                        </DialogHeader>
                        <div className="text-slate-300 mt-2">
                          {helpContent.secretKey}
                        </div>
                        <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-white">
                          <X className="h-4 w-4 text-white" />
                          <span className="sr-only">Close</span>
                        </button>
                      </DialogContent>
                    </Dialog>
                  </label>
                  <input
                    type="text"
                    name="secretkey"
                    value={formData.secretkey}
                    onChange={(e) => handleChange("secretkey", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Button
                  type="submit"
                  variant="default"
                  className="bg-emerald-500 hover:bg-emerald-600 transition-colors"
                >
                  Preview
                </Button>
              </div>
            </form>
          </div>
        ) : (
          // Form Preview Section
          <div
            className="mt-8 bg-slate-800/30 p-8 rounded-2xl border border-slate-700 shadow-xl 
            hover:scale-[1.01] hover:border-emerald-500/50 hover:shadow-emerald-500/20 hover:shadow-2xl 
            transition-all duration-300 ease-out"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-200">
                Form Preview
              </h2>
              <Button
                variant="default"
                className="bg-emerald-500 hover:bg-emerald-600 transition-colors"
                onClick={() => setShowPreview(false)}
              >
                Back to Form
              </Button>
            </div>

            <div className="mb-6 p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
              <h3 className="text-emerald-400 font-semibold mb-2">
                Hash Generation
              </h3>
              <p className="text-slate-300 mb-2">
                The hash is generated by concatenating these fields in exact
                order:
              </p>
              <ol className="list-decimal list-inside text-slate-300 mb-4">
                <li>storename</li>
                <li>txndatetime</li>
                <li>chargetotal</li>
                <li>currency</li>
                <li>secretkey</li>
              </ol>
              <p className="text-slate-300 mb-2">
                This concatenated string is then:
              </p>
              <ol className="list-decimal list-inside text-slate-300">
                <li>Converted to hex format</li>
                <li>Hashed using SHA-256</li>
              </ol>
              <p className="text-slate-300 mt-2">Final hash value:</p>
              <code className="block bg-slate-900 p-3 rounded text-sm font-mono text-emerald-400">
                {previewFormData?.hash}
              </code>
            </div>

            <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre">
              {`<form method="post" action="https://www3.ipg-online.com/connect/gateway/processing" target="_blank">
  <input type="hidden" name="chargetotal" value="${previewFormData?.chargetotal}" readOnly />
  <input type="hidden" name="currency" value="${previewFormData?.currency}" readOnly />
  <input type="hidden" name="hash_algorithm" value="${previewFormData?.hash_algorithm}" readOnly />
  <input type="hidden" name="hash" value="${previewFormData?.hash}" readOnly />
  <input type="hidden" name="responseFailURL" value="${previewFormData?.responseFailURL}" readOnly />
  <input type="hidden" name="responseSuccessURL" value="${previewFormData?.responseSuccessURL}" readOnly />
  <input type="hidden" name="storename" value="${previewFormData?.storename}" readOnly />
  <input type="hidden" name="timezone" value="${previewFormData?.timezone}" readOnly />
  <input type="hidden" name="txndatetime" value="${previewFormData?.txndatetime}" readOnly />
  <input type="hidden" name="txntype" value="${previewFormData?.txntype}" readOnly />
  <input type="hidden" name="mode" value="${previewFormData?.mode}" readOnly />
  <input type="hidden" name="oid" value="${previewFormData?.oid}" readOnly />
  <input type="hidden" name="authenticateTransaction" value="${previewFormData?.authenticateTransaction}" readOnly />
  <input type="hidden" name="assignToken" value="${previewFormData?.assignToken}" readOnly />
  <input type="hidden" name="checkoutoption" value="${previewFormData?.checkoutoption}" readOnly />
</form>`}
            </pre>
            <Button
              onClick={handleFinalSubmit}
              variant="default"
              className="mt-4 bg-emerald-500 hover:bg-emerald-600 transition-colors"
            >
              Submit
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
