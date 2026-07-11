-- Travel Companion V3-1 Checklist Cloud Validation
-- Updated: 2026-07-10
--
-- Run this in Supabase SQL Editor after:
-- docs/sql/001_checklist_cloud_schema.sql
--
-- This file is read-only. It checks whether checklist tables, indexes,
-- triggers, functions, grants, and RLS policies exist.

-- 1. Tables
select
  table_schema,
  table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('checklists', 'checklist_items')
order by table_name;

-- 2. Columns
-- checklist_items should include client_item_id so frontend local item IDs
-- can be mapped to cloud UUID rows during sync.
select
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('checklists', 'checklist_items')
order by table_name, ordinal_position;

-- 3. RLS enabled
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('checklists', 'checklist_items')
order by tablename;

-- 4. Policies
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('checklists', 'checklist_items')
order by tablename, policyname;

-- 5. Helper functions
select
  routine_schema,
  routine_name,
  routine_type
from information_schema.routines
where routine_schema = 'public'
  and routine_name in (
    'tc_current_email',
    'tc_is_super_admin',
    'tc_is_trip_editor',
    'tc_can_edit_shared_checklist',
    'tc_can_sync_private_checklist',
    'tc_touch_updated_at',
    'tc_prevent_checklist_identity_update'
  )
order by routine_name;

-- 6. Indexes
select
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('checklists', 'checklist_items')
order by tablename, indexname;

-- 7. Triggers
select
  event_object_table as table_name,
  trigger_name,
  action_timing,
  event_manipulation,
  action_statement
from information_schema.triggers
where trigger_schema = 'public'
  and event_object_table in ('checklists', 'checklist_items')
order by table_name, trigger_name;

-- 8. Grants
select
  table_schema,
  table_name,
  grantee,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('checklists', 'checklist_items')
  and grantee in ('anon', 'authenticated')
order by table_name, grantee, privilege_type;

-- 9. Existing admin_users shape.
-- This project currently uses admin_users(email, role, trip_id) as the
-- data-driven permission source. This query should return those columns.
select
  column_name,
  data_type,
  is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'admin_users'
  and column_name in ('email', 'role', 'trip_id')
order by column_name;
