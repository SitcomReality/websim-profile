# SitcomReality Project API Documentation

This document describes the API calls used to retrieve projects for the SitcomReality profile page.

## Main Projects Endpoint

**URL:** `/api/v1/users/{username}/projects`

**Method:** `GET`

**Parameters:**
- `posted=true` - Filters to only show posted projects (excludes drafts)
- `first=100` - Limits results to first 100 projects
- `sort_by=updated_at` - Sorts projects by most recently updated

**Example Request:**

