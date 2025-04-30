interface ApiKey {
  id: string;
  name: string;
  accessKeyId: string;
  secretKey: string;
  createdAt: Date;
  lastUsed: Date | null;
  expiresAt: Date | null;
  status: "active" | "expiring" | "expired";
}