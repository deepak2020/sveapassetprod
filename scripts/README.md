# Civic Topics Regeneration Script

This script deletes all existing civic topics and regenerates them with the new copyright-safe prompt.

## ⚠️ WARNING

This is a **destructive operation**:
- All existing CivicTopic records will be deleted
- New topics will be generated to replace them
- Make sure you have a database backup before running

## Usage

```bash
node scripts/regenerate-civic-topics.js
```

The script will:
1. Ask for confirmation (type "yes" to proceed)
2. Delete all existing civic topics
3. Generate 10 new topics with the safer prompt:
   - Swedish Government Structure
   - The Swedish Parliament (Riksdag)
   - Swedish Electoral System
   - Rights and Responsibilities of Citizens
   - Social Security in Sweden
   - Education System in Sweden
   - Swedish Labor Market and Employment Rights
   - Healthcare in Sweden
   - Gender Equality in Sweden
   - Integration and Diversity in Swedish Society

## What Changed

The new prompt:
- ✅ Uses ONLY official Swedish government sources (Sverige.se, Migrationsverket.se)
- ✅ Creates ORIGINAL explanations (not reproductions from textbooks)
- ✅ Avoids overlap with copyrighted materials like Sverige i Fokus
- ✅ Focuses on citizenship test preparation

## Safety Notes

- The script includes a 1-second delay between API calls to avoid rate limiting
- If deletion fails via SDK, you'll see a warning with topic IDs to delete manually via the base44 dashboard
- Generation can take 10-15 minutes depending on API response times
- Each topic includes content, key facts, and 4 quiz questions

## Troubleshooting

**"Host not in allowlist" error?**
- Run the script from your local environment where base44 API access is allowed
- Or ensure your server/container has proper network access to base44

**Generation failed midway?**
- Run the script again - it will skip already-generated topics by checking the database
- Or delete the partial topics manually and restart

**Want to customize topics?**
- Edit the `defaultTopics` array at the top of the script
- Add/remove/modify topic titles and categories
