export interface SecuritySettings {
  isLockEnabled: boolean;
  isBiometricsEnabled: boolean;
  pinCode: string; // 4-digit PIN
  autoLockDelaySeconds: number; // 0 = immediate, 60 = 1 min, 300 = 5 min
  lastActiveTimestamp: number;
}

export interface EncryptedBoxMetadata {
  name: string;
  nameAr: string;
  itemCount: number;
  cipherAlgorithm: string;
  isEncrypted: boolean;
  storageTarget: string;
  descriptionAr: string;
  descriptionEn: string;
}
