# Database Schema

This directory contains the database schema and migrations for the Polling App.

## Files

- `schema.sql` - Complete database schema with tables, policies, and functions

## Database Structure

### Tables

1. **polls**
   - Stores poll information
   - Fields: id, title, description, created_by, created_at, expires_at, is_public, allow_multiple_votes, total_votes, updated_at

2. **poll_options**
   - Stores options for each poll
   - Fields: id, poll_id, option_text, vote_count, created_at

3. **votes**
   - Stores individual votes
   - Fields: id, poll_id, option_id, user_id, anonymous_id, created_at, ip_address, user_agent

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- Policies for public/private poll access
- User authentication required for creating polls
- Anonymous voting support for public polls
- Vote validation to prevent duplicates

### Functions

- `has_user_voted()` - Check if a user has already voted on a poll
- `get_poll_results()` - Get poll results with vote counts and percentages
- Automatic vote count updates via triggers

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Run the SQL script

## Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Usage

The schema supports:
- ✅ User authentication via Supabase Auth
- ✅ Public and private polls
- ✅ Single and multiple choice voting
- ✅ Anonymous voting on public polls
- ✅ Poll expiration dates
- ✅ Real-time vote counting
- ✅ Vote validation and duplicate prevention

## Migration Notes

- This schema uses UUIDs for all primary keys
- Foreign key constraints ensure data integrity
- Indexes are created for optimal query performance
- Triggers automatically update vote counts
- RLS policies provide fine-grained access control
