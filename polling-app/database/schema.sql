-- Polling App Database Schema
-- This file contains the complete database schema for the polling application
-- Run this in your Supabase SQL editor or migration tool

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_public BOOLEAN DEFAULT true,
    allow_multiple_votes BOOLEAN DEFAULT false,
    total_votes INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll_options table
CREATE TABLE IF NOT EXISTS poll_options (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(poll_id, option_text)
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    anonymous_id TEXT, -- For anonymous votes (IP-based or session-based)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    UNIQUE(poll_id, user_id), -- Prevent duplicate votes from same user (if not allowing multiple)
    UNIQUE(poll_id, anonymous_id) -- Prevent duplicate anonymous votes
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_polls_created_by ON polls(created_by);
CREATE INDEX IF NOT EXISTS idx_polls_created_at ON polls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_polls_expires_at ON polls(expires_at);
CREATE INDEX IF NOT EXISTS idx_polls_is_public ON polls(is_public);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_option_id ON votes(option_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_anonymous_id ON votes(anonymous_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Polls policies
-- Anyone can view public polls
CREATE POLICY "Public polls are viewable by everyone" ON polls
    FOR SELECT USING (is_public = true);

-- Users can view their own polls (both public and private)
CREATE POLICY "Users can view their own polls" ON polls
    FOR SELECT USING (auth.uid() = created_by);

-- Authenticated users can create polls
CREATE POLICY "Authenticated users can create polls" ON polls
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own polls
CREATE POLICY "Users can update their own polls" ON polls
    FOR UPDATE USING (auth.uid() = created_by);

-- Users can delete their own polls
CREATE POLICY "Users can delete their own polls" ON polls
    FOR DELETE USING (auth.uid() = created_by);

-- Poll options policies
-- Anyone can view options for public polls
CREATE POLICY "Options for public polls are viewable by everyone" ON poll_options
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = poll_options.poll_id
            AND polls.is_public = true
        )
    );

-- Users can view options for their own polls
CREATE POLICY "Users can view options for their own polls" ON poll_options
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = poll_options.poll_id
            AND polls.created_by = auth.uid()
        )
    );

-- Users can create options for their own polls
CREATE POLICY "Users can create options for their own polls" ON poll_options
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = poll_options.poll_id
            AND polls.created_by = auth.uid()
        )
    );

-- Users can update options for their own polls
CREATE POLICY "Users can update options for their own polls" ON poll_options
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = poll_options.poll_id
            AND polls.created_by = auth.uid()
        )
    );

-- Users can delete options for their own polls
CREATE POLICY "Users can delete options for their own polls" ON poll_options
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = poll_options.poll_id
            AND polls.created_by = auth.uid()
        )
    );

-- Votes policies
-- Anyone can view votes for public polls
CREATE POLICY "Votes for public polls are viewable by everyone" ON votes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = votes.poll_id
            AND polls.is_public = true
        )
    );

-- Users can view votes for their own polls
CREATE POLICY "Users can view votes for their own polls" ON votes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = votes.poll_id
            AND polls.created_by = auth.uid()
        )
    );

-- Authenticated users can vote on public polls
CREATE POLICY "Authenticated users can vote on public polls" ON votes
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = votes.poll_id
            AND polls.is_public = true
        )
    );

-- Allow anonymous votes on public polls (if anonymous_id is provided)
CREATE POLICY "Anonymous users can vote on public polls" ON votes
    FOR INSERT WITH CHECK (
        anonymous_id IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = votes.poll_id
            AND polls.is_public = true
        )
    );

-- Users can delete their own votes
CREATE POLICY "Users can delete their own votes" ON votes
    FOR DELETE USING (auth.uid() = user_id);

-- Functions for updating vote counts

-- Function to update poll total_votes
CREATE OR REPLACE FUNCTION update_poll_total_votes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE polls
    SET total_votes = (
        SELECT COUNT(*) FROM votes WHERE votes.poll_id = polls.id
    )
    WHERE id = COALESCE(NEW.poll_id, OLD.poll_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update option vote_count
CREATE OR REPLACE FUNCTION update_option_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE poll_options
    SET vote_count = (
        SELECT COUNT(*) FROM votes WHERE votes.option_id = poll_options.id
    )
    WHERE id = COALESCE(NEW.option_id, OLD.option_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update vote counts
CREATE TRIGGER trigger_update_poll_total_votes
    AFTER INSERT OR DELETE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_poll_total_votes();

CREATE TRIGGER trigger_update_option_vote_count
    AFTER INSERT OR DELETE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_option_vote_count();

-- Function to check if user has already voted (for single-vote polls)
CREATE OR REPLACE FUNCTION has_user_voted(poll_uuid UUID, user_uuid UUID DEFAULT NULL, anon_id TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM votes
        WHERE poll_id = poll_uuid
        AND (
            (user_uuid IS NOT NULL AND user_id = user_uuid)
            OR (anon_id IS NOT NULL AND anonymous_id = anon_id)
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get poll results
CREATE OR REPLACE FUNCTION get_poll_results(poll_uuid UUID)
RETURNS TABLE (
    option_id UUID,
    option_text TEXT,
    vote_count INTEGER,
    percentage DECIMAL
) AS $$
DECLARE
    total_votes_count INTEGER;
BEGIN
    -- Get total votes for the poll
    SELECT total_votes INTO total_votes_count
    FROM polls WHERE id = poll_uuid;

    -- Return results with percentages
    RETURN QUERY
    SELECT
        po.id,
        po.option_text,
        po.vote_count,
        CASE
            WHEN total_votes_count > 0 THEN
                ROUND((po.vote_count::DECIMAL / total_votes_count) * 100, 2)
            ELSE 0
        END as percentage
    FROM poll_options po
    WHERE po.poll_id = poll_uuid
    ORDER BY po.vote_count DESC, po.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON polls TO anon, authenticated;
GRANT ALL ON poll_options TO anon, authenticated;
GRANT ALL ON votes TO anon, authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION has_user_voted(UUID, UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_poll_results(UUID) TO anon, authenticated;
