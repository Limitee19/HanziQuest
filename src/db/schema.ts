import { sqliteTable, text, real, integer, index } from 'drizzle-orm/sqlite-core';

// 1. App Metadata Table (Stores immutable appStartDate and system settings)
export const appMetadata = sqliteTable('app_metadata', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 2. Calendar Entries Table
export const calendarEntries = sqliteTable('calendar_entries', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  date: text('date').notNull(), // Formatted YYYY-MM-DD
  startTime: text('start_time'),
  endTime: text('end_time'),
  location: text('location'),
  category: text('category').default('Personal'),
  priority: text('priority').default('normal'), // 'normal' | 'high' | 'urgent'
  isImportant: integer('is_important', { mode: 'boolean' }).default(false),
  isCompleted: integer('is_completed', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => [
  index('date_idx').on(table.date),
]);

// 3. Notes Table
export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  date: text('date'), // Optional date attachment (YYYY-MM-DD)
  title: text('title').notNull(),
  body: text('body').default(''),
  tags: text('tags').default('[]'), // JSON array string
  isPinned: integer('is_pinned', { mode: 'boolean' }).default(false),
  isImportant: integer('is_important', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => [
  index('notes_date_idx').on(table.date),
]);

// 4. Financial Accounts Table
export const financialAccounts = sqliteTable('financial_accounts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'cash' | 'bank' | 'ewallet' | 'other'
  startingBalance: real('starting_balance').default(0),
  currentBalance: real('current_balance').default(0),
  note: text('note'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 5. Financial Categories Table
export const financialCategories = sqliteTable('financial_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'income' | 'expense'
  icon: text('icon'),
  color: text('color'),
});

// 6. Financial Transactions Table
export const financialTransactions = sqliteTable('financial_transactions', {
  id: text('id').primaryKey(),
  amount: real('amount').notNull(),
  type: text('type').notNull(), // 'income' | 'expense' | 'transfer'
  date: text('date').notNull(), // YYYY-MM-DD
  categoryId: text('category_id'),
  accountId: text('account_id').notNull(),
  destinationAccountId: text('destination_account_id'), // For transfers
  description: text('description'),
  note: text('note'),
  createdAt: text('created_at').notNull(),
}, (table) => [
  index('trans_date_idx').on(table.date),
  index('trans_account_idx').on(table.accountId),
]);

// 7. Financial Budgets Table
export const budgets = sqliteTable('budgets', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull(),
  monthlyLimit: real('monthly_limit').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 8. Vault Categories Table
export const vaultCategories = sqliteTable('vault_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

// 9. Vault Entries Table
export const vaultEntries = sqliteTable('vault_entries', {
  id: text('id').primaryKey(),
  serviceName: text('service_name').notNull(),
  username: text('username'),
  email: text('email'),
  encryptedPassword: text('encrypted_password'),
  accountId: text('account_id'),
  recoveryInfo: text('recovery_info'),
  notes: text('notes'),
  url: text('url'),
  categoryId: text('category_id'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => [
  index('vault_service_idx').on(table.serviceName),
]);
