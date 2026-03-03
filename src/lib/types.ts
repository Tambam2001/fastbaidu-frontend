// types.ts — shared TypeScript types for FastBaidu
// Import từ đây, không tạo duplicate types trong components/stores

// ─── Job system ───────────────────────────────────────────────────────────────

export type JobStatus = 'pending' | 'running' | 'done' | 'failed' | 'cancelled'
export type JobType = 'transfer' | 'cleanup'

export interface Job<TPayload = unknown, TResult = unknown> {
  id: string
  user_id: string
  type: JobType
  status: JobStatus
  payload?: TPayload
  result?: TResult
  error_msg?: string
  progress_pct?: number
  total_bytes?: number
  transferred_bytes?: number
  speed_bps?: number
  created_at: string
  updated_at: string
}

export interface ProgressEvent {
  job_id: string
  stage: string
  percent: number
  message: string
  data?: unknown
  error?: string
  speed_bps?: number
  eta_seconds?: number
  processed_bytes?: number
  total_bytes?: number
}

// ─── Transfer ─────────────────────────────────────────────────────────────────

export type TransferStage = 'parsing' | 'transferring' | 'downloading' | 'uploading' | 'complete'

export interface TransferPayload {
  share_url: string
  access_code?: string
  file_ids?: string[]
  cloud_dest: 'gdrive' | 'onedrive'
  zip_name?: string
}

export interface TransferResult {
  total_files: number
  total_bytes: number
  cloud_path: string
  download_url?: string
  expires_at?: string
}

export interface TransferFile {
  id: string
  job_id: string
  baidu_path: string
  cloud_path: string
  filename: string
  size_bytes: number
  transferred_bytes: number
  status: 'pending' | 'processing' | 'done' | 'error' | 'skipped'
  download_url?: string
  error_msg?: string
}

// ─── Share Preview ────────────────────────────────────────────────────────────

export interface ShareFile {
  fs_id: string
  name: string
  path: string
  size: number
  is_dir: boolean
}

export interface SharePreview {
  files: ShareFile[]
  total_size: number
  total_size_gb: number
  file_count: number
  folder_count: number
  cost_usd: number
}

// ─── Orders & Plans ───────────────────────────────────────────────────────────

export interface Plan {
  name: string
  quota_gb: number
  price_usd: number
}

export interface Order {
  id: string
  user_id: string
  plan: string
  quota_bytes: number
  price_usd: number
  payment_method: 'paypal' | 'nowpayments'
  payment_id?: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  created_at: string
}

export interface CreateOrderResult {
  order: Order
  payment_url?: string
}

// ─── Quota ────────────────────────────────────────────────────────────────────

export interface QuotaInfo {
  quota_bytes: number
  quota_gb: number
  total_purchased_bytes: number
  total_purchased_gb: number
  free_tier_used: boolean
  free_tier_available: boolean
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  telegram_id?: number
  username?: string
  name: string
  email?: string
  first_name?: string
  last_name?: string
  avatar?: string
  avatarUrl?: string
}

export interface Transaction {
  id: string;
  created: string;
  type: string;
  method: string;
  amount_gb: number;
  amount_usd: number;
  task_id?: string;
}

// ─── UI state ─────────────────────────────────────────────────────────────────

export type LoadState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  state: LoadState
  data: T | null
  error: string | null
}

export function initialAsync<T>(): AsyncState<T> {
  return { state: 'idle', data: null, error: null }
}

// ─── Added from Old UI Migration ────────────────────────────────────────────────

export interface Task {
  id: string;
  url: string;
  status: string;
  size_gb: number;
  total_size?: number;
  total_files?: number;
  error_msg?: string;
  gdrive_link?: string;
  created?: string;
  completed_at?: string;
  message?: string;
}

export type TaskStatus = "pending" | "transferring" | "completed" | "failed" | "processing" | "pending_payment";

export interface UserBalance {
  balance_gb: number;
  total_spent_usd: number;
  is_telegram_user: boolean;
}

export interface PreviewFile {
  name: string;
  size: number;
  is_dir: boolean;
  path: string;
}

export interface PreviewResponse {
  files: PreviewFile[];
  total_size_gb: number;
}
