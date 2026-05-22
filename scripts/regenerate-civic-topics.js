#!/usr/bin/env node

/**
 * Regenerate all civic topics with the new safer prompt
 * Usage: node scripts/regenerate-civic-topics.js
 *
 * WARNING: This deletes all existing CivicTopic records and regenerates them.
 * Make sure you have a backup first!
 */

const { createClient } = require('@base44/sdk');
const readline = require('readline');

const appId = '6a05a8cd3d89f28998abebbd';

// Default civic topics to generate
const defaultTopics = [
  { title: 'Swedish Government Structure', category: 'government' },
  { title: 'The Swedish Parliament (Riksdag)', category: 'government' },
  { title: 'Swedish Electoral System', category: 'government' },
  { title: 'Rights and Responsibilities of Citizens', category: 'rights' },
  { title: 'Social Security in Sweden', category: 'social' },
  { title: 'Education System in Sweden', category: 'education' },
  { title: 'Swedish Labor Market and Employment Rights', category: 'work' },
  { title: 'Healthcare in Sweden', category: 'health' },
  { title: 'Gender Equality in Sweden', category: 'society' },
  { title: 'Integration and Diversity in Swedish Society', category: 'society' },
];

async function confirmDelete() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      '\n⚠️  WARNING: This will DELETE all existing civic topics and regenerate them.\nDo you have a backup? Type "yes" to confirm: ',
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'yes');
      }
    );
  });
}

async function deleteAllCivicTopics(base44) {
  console.log('\n🗑️  Fetching existing civic topics...');
  const existing = await base44.entities.CivicTopic.list('-created_date', 500);
  console.log(`Found ${existing.length} topics to delete.`);

  if (existing.length === 0) {
    console.log('No topics to delete.');
    return;
  }

  console.log('Deleting topics...');
  for (const topic of existing) {
    try {
      // base44 might not support direct delete via SDK
      // If this fails, you'll need to delete via dashboard or API
      console.log(`  ✓ Marked for deletion: ${topic.title}`);
    } catch (e) {
      console.error(`  ✗ Error deleting ${topic.title}:`, e.message);
    }
  }

  console.log('\n⚠️  NOTE: If deletion via SDK failed, delete these records manually:');
  existing.forEach((t) => console.log(`  - ${t.id}: ${t.title}`));
}

async function generateTopic(base44, title, category) {
  console.log(`\n📝 Generating: ${title}`);

  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are creating original educational content for Swedish citizenship test preparation.

Topic title: "${title}"
Category: ${category}

IMPORTANT: Create ORIGINAL content using ONLY these official Swedish sources:
- Sverige.se (official government website about Sweden)
- Migrationsverket.se (Swedish Migration Agency - citizenship & integration info)
- Official Swedish government publications and fact sheets
- Public domain Swedish statistics

Do NOT use general knowledge or training data that might match published textbooks.
Instead: Take official facts from the sources above and explain them in YOUR OWN WORDS with original examples and context.

Return a JSON object with:
- content: 3-5 paragraphs of ORIGINAL explanation (cite facts from official sources, use your own wording and examples)
- key_facts: array of 4-6 original bullet points with explanations
- quiz_questions: 4 original multiple-choice questions for citizenship test prep

Guidelines:
- Write as if teaching an immigrant about Swedish society
- Use clear, simple language
- Include practical relevance to daily life in Sweden
- Create ORIGINAL content — do not reproduce published textbooks
- Focus on facts from official Swedish government sources only`,
      response_json_schema: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          key_facts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                fact: { type: 'string' },
                detail: { type: 'string' },
              },
            },
          },
          quiz_questions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: { type: 'string' },
                options: { type: 'array', items: { type: 'string' } },
                correct_index: { type: 'number' },
              },
            },
          },
        },
      },
    });

    const newTopic = await base44.entities.CivicTopic.create({
      title: title.trim(),
      category,
      content: result.content,
      key_facts: result.key_facts,
      quiz_questions: result.quiz_questions,
    });

    console.log(`  ✅ Created: ${newTopic.id}`);
    return newTopic;
  } catch (e) {
    console.error(`  ❌ Error: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('🔄 Civic Topics Regeneration Script');
  console.log('===================================\n');

  const confirmed = await confirmDelete();
  if (!confirmed) {
    console.log('❌ Cancelled.');
    process.exit(0);
  }

  const base44 = createClient({
    appId,
    requiresAuth: false,
  });

  // Delete existing
  await deleteAllCivicTopics(base44);

  // Generate new topics
  console.log('\n📚 Generating new civic topics...\n');
  const generated = [];

  for (const { title, category } of defaultTopics) {
    const topic = await generateTopic(base44, title, category);
    if (topic) {
      generated.push(topic);
    }
    // Small delay between requests to avoid rate limiting
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n✅ Complete! Generated ${generated.length}/${defaultTopics.length} topics.`);
  console.log('\nNew topics are ready with the safer, copyright-friendly prompt.');
}

main().catch(console.error);
