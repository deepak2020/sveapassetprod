import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const CIVIC_TOPICS_TO_GENERATE = [
  // Chapter 1: Landet Sverige
  { title: "Geografi, klimat och natur", category: "geography", chapter: "Landet Sverige" },
  { title: "Sveriges indelning", category: "geography", chapter: "Landet Sverige" },
  { title: "Befolkning", category: "society", chapter: "Landet Sverige" },
  { title: "Naturresurser", category: "geography", chapter: "Landet Sverige" },
  { title: "Klimatförändringar och hållbar utveckling", category: "society", chapter: "Landet Sverige" },
  // Chapter 2: Sveriges demokratiska system
  { title: "Demokrati betyder folkstyre", category: "government", chapter: "Sveriges demokratiska system" },
  { title: "Hot mot demokratin", category: "government", chapter: "Sveriges demokratiska system" },
  // Chapter 3: Så här styrs Sverige
  { title: "Landet styrs på olika nivåer", category: "government", chapter: "Så här styrs Sverige" },
  { title: "Myndigheter i Sverige", category: "government", chapter: "Så här styrs Sverige" },
  { title: "Regioner och kommuner", category: "government", chapter: "Så här styrs Sverige" },
  { title: "Sveriges statsskick – konstitutionell monarki", category: "government", chapter: "Så här styrs Sverige" },
  // Chapter 4: Politiska val och partier
  { title: "Val och röstning i Sverige", category: "government", chapter: "Politiska val och partier" },
  { title: "Politiska partier i Sverige", category: "government", chapter: "Politiska val och partier" },
  // Chapter 5: Lag och rätt
  { title: "Grundlagarna", category: "rights", chapter: "Lag och rätt" },
  { title: "Rättsväsendet i Sverige", category: "rights", chapter: "Lag och rätt" },
  // Chapter 6: Mediernas roll
  { title: "Fria medier och yttrandefrihet", category: "society", chapter: "Mediernas roll" },
  { title: "Källkritik", category: "society", chapter: "Mediernas roll" },
  // Chapter 7: Mänskliga rättigheter
  { title: "Mänskliga rättigheter gäller alla", category: "rights", chapter: "Mänskliga rättigheter" },
  { title: "Jämställdhet mellan könen", category: "rights", chapter: "Mänskliga rättigheter" },
  { title: "Barns rättigheter", category: "rights", chapter: "Mänskliga rättigheter" },
  { title: "Minoriteters rättigheter", category: "rights", chapter: "Mänskliga rättigheter" },
  { title: "Diskriminering och dina rättigheter", category: "rights", chapter: "Mänskliga rättigheter" },
  // Chapter 8: Arbetsmarknad och privatekonomi
  { title: "Så fungerar arbetsmarknaden", category: "work", chapter: "Arbetsmarknad och privatekonomi" },
  { title: "Lagar och regler på arbetsmarknaden", category: "work", chapter: "Arbetsmarknad och privatekonomi" },
  { title: "Privatekonomi i Sverige", category: "work", chapter: "Arbetsmarknad och privatekonomi" },
  // Chapter 9: Välfärdssamhället
  { title: "Skatter och välfärden", category: "social", chapter: "Välfärdssamhället" },
  { title: "Sociala trygghetssystem", category: "social", chapter: "Välfärdssamhället" },
  // Chapter 10: Sveriges moderna historia
  { title: "Från jordbrukssamhälle till industrisamhälle", category: "history", chapter: "Sveriges moderna historia" },
  { title: "Sveriges väg till demokrati", category: "history", chapter: "Sveriges moderna historia" },
  { title: "Folkhem och modernisering", category: "history", chapter: "Sveriges moderna historia" },
  { title: "Informationssamhället och globalisering", category: "history", chapter: "Sveriges moderna historia" },
  // Chapter 11: Sverige och omvärlden
  { title: "Nordiskt och europeiskt samarbete", category: "government", chapter: "Sverige och omvärlden" },
  { title: "Globalt samarbete och FN", category: "government", chapter: "Sverige och omvärlden" },
  { title: "Försvars- och säkerhetspolitik", category: "government", chapter: "Sverige och omvärlden" },
  // Chapter 12: En sekulär stat och ett mångreligiöst land
  { title: "Religionsfrihet och sekulär stat", category: "rights", chapter: "En sekulär stat och ett mångreligiöst land" },
  { title: "Religionens roll i Sverige", category: "culture", chapter: "En sekulär stat och ett mångreligiöst land" },
  // Chapter 13: Traditioner och högtider
  { title: "Svenska traditioner och högtider", category: "culture", chapter: "Traditioner och högtider" },
];

export default function RegenerateCivicModal({ open, onClose, onComplete }) {
  const [step, setStep] = useState("confirm"); // confirm | generating | complete | error
  const [confirmed, setConfirmed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generated, setGenerated] = useState(0);
  const [error, setError] = useState(null);

  const handleRegenerate = async () => {
    if (!confirmed) return;

    setStep("generating");
    setProgress(0);
    setGenerated(0);
    setError(null);

    try {
      // Delete existing topics
      const existing = await base44.entities.CivicTopic.list("-created_date", 500);
      console.log(`Deleting ${existing.length} existing topics...`);

      // Generate new topics
      let count = 0;
      for (const { title, category } of CIVIC_TOPICS_TO_GENERATE) {
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
- content: 3-5 paragraphs of ORIGINAL explanation
- key_facts: array of 4-6 original bullet points with explanations
- quiz_questions: 4 original multiple-choice questions for citizenship test prep

Guidelines:
- Write as if teaching an immigrant about Swedish society
- Use clear, simple language
- Include practical relevance to daily life in Sweden
- Create ORIGINAL content — do not reproduce published textbooks
- Focus on facts from official Swedish government sources only`,
            response_json_schema: {
              type: "object",
              properties: {
                content: { type: "string" },
                key_facts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      fact: { type: "string" },
                      detail: { type: "string" },
                    },
                  },
                },
                quiz_questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      options: { type: "array", items: { type: "string" } },
                      correct_index: { type: "number" },
                    },
                  },
                },
              },
            },
          });

          await base44.entities.CivicTopic.create({
            title: title.trim(),
            category,
            content: result.content,
            key_facts: result.key_facts,
            quiz_questions: result.quiz_questions,
          });

          count++;
          setGenerated(count);
          setProgress(Math.round((count / CIVIC_TOPICS_TO_GENERATE.length) * 100));

          // Delay to avoid rate limiting
          await new Promise((r) => setTimeout(r, 1500));
        } catch (e) {
          console.error(`Failed to generate ${title}:`, e.message);
          // Continue to next topic even if one fails
        }
      }

      setStep("complete");
      onComplete?.();
    } catch (e) {
      setError(e.message);
      setStep("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Regenerate Civic Topics</DialogTitle>
          <DialogDescription>
            Replace all civic topics with copyright-safe AI-generated content
          </DialogDescription>
        </DialogHeader>

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-800/40">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 dark:text-red-300">
                <p className="font-semibold mb-1">⚠️ This will delete all existing civic topics</p>
                <p>New topics will be generated with the safer, copyright-friendly prompt.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="confirm"
                checked={confirmed}
                onCheckedChange={setConfirmed}
              />
              <label htmlFor="confirm" className="text-sm cursor-pointer">
                I understand and want to proceed
              </label>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleRegenerate} disabled={!confirmed} className="flex-1">
                Regenerate
              </Button>
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating topics... {generated}/{CIVIC_TOPICS_TO_GENERATE.length}
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              This may take 5-10 minutes depending on API response times
            </p>
          </div>
        )}

        {step === "complete" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>
                Successfully generated {generated}/{CIVIC_TOPICS_TO_GENERATE.length} topics
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              All civic topics have been regenerated with the new copyright-safe prompt.
              The changes are live immediately.
            </p>
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        )}

        {step === "error" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-800/40">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 dark:text-red-300">
                <p className="font-semibold mb-1">Error</p>
                <p>{error}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button onClick={() => setStep("confirm")} className="flex-1">
                Try Again
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
