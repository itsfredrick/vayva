import { FastifyInstance } from "fastify";
import {
  verifyPaymentHandler,
  webhookHandler,
  listTransactionsHandler,
  initializeTransactionHandler,
} from "./controller";
import {
  createDisputeHandler,
  listDisputesHandler,
  getDisputeHandler,
  addEvidenceHandler,
} from "./controllers/dispute.controller";
import {
  getWalletSummaryHandler,
  getLedgerHandler,
  setPinHandler,
  verifyPinHandler,
  createVirtualAccountHandler,
  listBanksHandler,
  addBankHandler,
  deleteBankHandler,
  initiateWithdrawalHandler,
  confirmWithdrawalHandler,
  submitKycHandler,
  getKycStatusHandler,
  listPendingKycHandler,
  reviewKycHandler,
} from "./wallet.controller";

export const paymentRoutes = async (server: FastifyInstance) => {
  // Current Payments
  server.post("/verify", verifyPaymentHandler);
  server.post("/webhook", webhookHandler);
  server.get("/transactions", listTransactionsHandler);
  server.post("/initialize", initializeTransactionHandler);

  // Wallet & Security (Integration 3)
  server.get("/wallet/summary", getWalletSummaryHandler);
  server.get("/wallet/ledger", getLedgerHandler);
  server.post("/wallet/pin/set", setPinHandler);
  server.post("/wallet/pin/verify", verifyPinHandler);

  // KYC (Integration 4)
  server.post("/kyc/submit", submitKycHandler);
  server.get("/kyc/status", getKycStatusHandler);

  // Ops KYC Review
  server.get("/ops/kyc/pending", listPendingKycHandler);
  server.post("/ops/merchants/:id/kyc/review", reviewKycHandler);

  // DVA & Banks
  server.post("/wallet/virtual-account/create", createVirtualAccountHandler);
  server.get("/wallet/banks", listBanksHandler);
  server.post("/wallet/banks", addBankHandler);
  server.delete("/wallet/banks/:id", deleteBankHandler);

  // Withdrawals
  server.post("/wallet/withdraw/initiate", initiateWithdrawalHandler);
  server.post("/wallet/withdraw/confirm", confirmWithdrawalHandler);

  // Disputes (Integration 22A)
  server.post("/disputes", createDisputeHandler);
  server.get("/disputes", listDisputesHandler);
  server.get("/disputes/:id", getDisputeHandler);
  server.post("/disputes/:id/evidence", addEvidenceHandler);
};
