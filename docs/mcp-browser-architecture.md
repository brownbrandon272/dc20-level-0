# Courtside Labs - Architecture & Design Document

## Available MCP Servers

This project has access to the following MCP (Model Context Protocol) servers that should be used automatically where appropriate:

### 1. Playwright MCP
- **Purpose**: Browser automation and testing
- **When to use**: 
  - Testing web application functionality
  - Automating browser interactions
  - Taking screenshots for visual testing
  - Debugging UI behavior
  - Verifying user flows
- **Available tools**: Browser navigation, element interaction, screenshot capture, network monitoring, console logging

### 2. Context7 MCP
- **Purpose**: Retrieve up-to-date documentation and code examples for any library
- **When to use**:
  - Looking up latest library documentation
  - Finding code examples and best practices
  - Checking API changes or new features
  - Resolving version-specific issues
- **Usage pattern**:
  1. First call `resolve-library-id` to get the Context7-compatible library ID
  2. Then call `get-library-docs` with that ID to retrieve documentation

### 3. Supabase MCP
- **Purpose**: Database operations and management for the Supabase backend
- **When to use**:
  - Creating or modifying database schema
  - Running SQL queries for data analysis
  - Managing database migrations
  - Configuring row-level security (RLS) policies
  - Monitoring database performance and advisories
  - Testing database operations
- **Key operations**:
  - `apply_migration`: Apply schema changes with version tracking
  - `execute_sql`: Run queries for data operations
  - `list_tables`: View database structure
  - `get_advisors`: Check for security and performance recommendations
- **Data update pattern**: 
  - The `rosprojection` table uses TRUNCATE + INSERT for bulk updates
  - This maintains data freshness while preserving indexes and RLS policies
- **Available tools**: Migration management, SQL execution, table listing, log retrieval, advisor checks
