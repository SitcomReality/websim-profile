
```markdown
# WebSim Profile API Format

This document describes the structure of project objects returned by the WebSim API when fetching user profiles and projects.

## Project Object Structure

The API returns project data in the following structure:

```javascript
{
  project: {
    id: string,           // Unique project identifier
    title: string,        // Project title
    description: string,    // Project description
    created_at: string,   // ISO timestamp of creation
    updated_at: string,   // ISO timestamp of last update
    stats: {
      views: number,      // View count
      likes: number,      // Like count
      comments: number    // Comment count
    }
  },
  project_revision: {
    id: string,                          // Revision ID
    current_screenshot_url: string      // URL to project thumbnail image
  },
  site: {
    id: string,         // Site ID (if published)
    url: string         // Site URL
  }
}
```