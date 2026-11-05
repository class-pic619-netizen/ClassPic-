declare module "promptpay-qr" {
  interface PromptPayOptions {
    amount?: number;
  }
  function promptpayQR(id: string, options?: PromptPayOptions): string;
  export default promptpayQR;
}
