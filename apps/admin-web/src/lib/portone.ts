"use client";

type IamportResponse = {
  success: boolean;
  error_msg?: string;
};

declare global {
  interface Window {
    IMP?: {
      init: (key: string) => void;
      request_pay: (
        params: Record<string, unknown>,
        callback: (rsp: IamportResponse) => void,
      ) => void;
    };
  }
}

export function isPortOneV2Configured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_PORTONE_STORE_ID &&
      process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
  );
}

export function isPortOneV1Configured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_PORTONE_IMP_KEY);
}

export function isPortOneConfigured(): boolean {
  return isPortOneV2Configured() || isPortOneV1Configured();
}

function loadIamportScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("브라우저에서만 결제할 수 있습니다."));
  }
  if (window.IMP) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("PortOne 스크립트 로드에 실패했습니다."));
    document.head.appendChild(script);
  });
}

export async function openPortOnePayment(options: {
  merchantUid: string;
  amount: number;
  orderName: string;
  redirectUrl?: string;
}): Promise<{ success: boolean; message?: string }> {
  const { merchantUid, amount, orderName, redirectUrl } = options;

  if (isPortOneV2Configured()) {
    const PortOne = await import("@portone/browser-sdk/v2");
    const response = await PortOne.requestPayment({
      storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
      channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
      paymentId: merchantUid,
      orderName,
      totalAmount: amount,
      currency: "CURRENCY_KRW",
      payMethod: "CARD",
      redirectUrl,
    });

    if (response && "code" in response && response.code) {
      return {
        success: false,
        message: response.message ?? "결제에 실패했습니다.",
      };
    }

    return { success: true };
  }

  const impKey = process.env.NEXT_PUBLIC_PORTONE_IMP_KEY;
  if (!impKey) {
    return {
      success: false,
      message:
        "PortOne 환경 변수가 없습니다. NEXT_PUBLIC_PORTONE_STORE_ID/CHANNEL_KEY 또는 IMP_KEY를 설정하세요.",
    };
  }

  await loadIamportScript();

  return new Promise((resolve) => {
    window.IMP!.init(impKey);
    window.IMP!.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: merchantUid,
        name: orderName,
        amount,
        m_redirect_url: redirectUrl,
      },
      (rsp) => {
        if (rsp.success) {
          resolve({ success: true });
          return;
        }
        resolve({
          success: false,
          message: rsp.error_msg ?? "결제가 취소되었습니다.",
        });
      },
    );
  });
}
