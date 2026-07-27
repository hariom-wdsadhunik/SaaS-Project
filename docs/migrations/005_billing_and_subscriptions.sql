-- Migration: 005_billing_and_subscriptions.sql
-- Description: Billing, subscriptions, plans, invoices, payments, and usage records tables with strict multi-tenant RLS

CREATE TABLE IF NOT EXISTS public.plans (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    tier VARCHAR(32) NOT NULL,
    monthly_price_usd NUMERIC(10,2) NOT NULL,
    yearly_price_usd NUMERIC(10,2) NOT NULL,
    limits JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    plan_id VARCHAR(64) NOT NULL REFERENCES public.plans(id),
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    seats INTEGER NOT NULL DEFAULT 1,
    interval VARCHAR(16) NOT NULL DEFAULT 'month',
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    stripe_customer_id VARCHAR(128),
    stripe_subscription_id VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    amount_due_usd NUMERIC(10,2) NOT NULL,
    amount_paid_usd NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(32) NOT NULL DEFAULT 'open',
    lines JSONB NOT NULL DEFAULT '[]'::jsonb,
    pdf_url TEXT,
    stripe_invoice_id VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    metric VARCHAR(64) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Strict Multi-Tenant Row Level Security (RLS)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant boundary isolation for subscriptions"
    ON public.subscriptions
    FOR ALL
    USING (organization_id = (auth.jwt() ->> 'organization_id')::uuid);

CREATE POLICY "Tenant boundary isolation for invoices"
    ON public.invoices
    FOR ALL
    USING (organization_id = (auth.jwt() ->> 'organization_id')::uuid);

CREATE POLICY "Tenant boundary isolation for usage_records"
    ON public.usage_records
    FOR ALL
    USING (organization_id = (auth.jwt() ->> 'organization_id')::uuid);
