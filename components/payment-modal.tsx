import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface PaymentModalProps {
  snapToken: string;
  clientKey: string;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal = ({ snapToken, clientKey, onClose, onPaymentSuccess }: PaymentModalProps) => {
  const { t } = useI18n();
  const [snap, setSnap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !snap) {
      const midtransScript = document.createElement("script");
      midtransScript.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      if (clientKey) {
        midtransScript.setAttribute("data-client-key", clientKey);
      }
      midtransScript.async = true;
      midtransScript.onload = () => {
        if ((window as any).snap) {
          const snapInstance = (window as any).snap;
          snapInstance.pay(snapToken, {
            onSuccess: (result: any) => {
              onPaymentSuccess();
            },
            onPending: (result: any) => {
              setError(t("dashboard.domains.paymentPending"));
            },
            onError: (result: any) => {
              setError(result?.error_message || t("dashboard.domains.paymentFailed"));
            },
            onClose: () => {
              onClose();
            },
          });
          setSnap(snapInstance);
        } else {
          setError("Midtrans Snap failed to load");
        }
      };
      midtransScript.onerror = () => {
        setError("Failed to load payment gateway");
      };
      document.body.appendChild(midtransScript);

      return () => {
        const existing = document.querySelector('script[src*="midtrans"]');
        if (existing) existing.remove();
      };
    }
  }, [snapToken, clientKey, onPaymentSuccess, onClose, t]);

  const handleManualCheck = () => {
    onPaymentSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t("dashboard.domains.paymentTitle") || "Pembayaran"}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {error ? (
          <div className="text-center py-4">
            <p className="text-sm text-destructive mb-3">{error}</p>
            <button
              onClick={handleManualCheck}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
            >
              {t("dashboard.domains.paymentManualCheck") || "Cek Status Pembayaran"}
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-muted/30 rounded-full mb-3">
              <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">{t("dashboard.domains.paymentLoading") || "Membuka gateway pembayaran..."}</p>
            <p className="text-xs text-muted-foreground mt-2 mb-3">
              {t("dashboard.domains.paymentInstruction") || "Jika tidak terbuka otomatis, klik di bawah ini"}
            </p>
            <button
              onClick={handleManualCheck}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
            >
              {t("dashboard.domains.paymentOpenGateway") || "Buka Gateway Pembayaran"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
