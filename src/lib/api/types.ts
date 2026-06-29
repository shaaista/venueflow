export type ApiUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  isSuperAdmin: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
};

export type ApiOrg = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  brandColor: string;
  role: string;
};

export type LoginResult =
  | { user: ApiUser; accessToken: string; refreshToken: string }
  | { twoFactorRequired: true };

export type MeResult = { user: ApiUser; organizations: ApiOrg[] };

export type Paginated<T> = { data: T[]; meta?: { total: number; page: number; pageSize: number; totalPages: number } };
