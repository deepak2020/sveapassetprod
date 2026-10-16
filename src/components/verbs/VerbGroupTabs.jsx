import { VERB_GROUPS } from "@/lib/verbs";

export default function VerbGroupTabs({ active, onSelect }) {
  return (
    <div className="-mx-4 px-4 overflow-x-auto">
      <div className="flex gap-2 w-max">
        {VERB_GROUPS.map((group) => {
          const isActive = active === group.id;
          return (
            <button
              key={group.id}
              onClick={() => onSelect(group.id)}
              className={`shrink-0 rounded-full border-2 px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 bg-card hover:border-primary/40"
              }`}
            >
              {group.label}
              {group.hint && <span className="ml-1 font-normal italic opacity-80">{group.hint}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}