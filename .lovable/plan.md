

# Fix: Allow Multiple Recipes to be Expanded Simultaneously

## Problem Identified
The `expandedRecipe` state is stored as a single `string | null`, meaning only one recipe ID can be tracked as "expanded" at a time. This creates the flip-flop behavior where expanding one recipe automatically collapses the other.

## Solution
Change the state from a single string to a **Set of strings** (or array) that tracks multiple expanded recipe IDs.

## Technical Changes

### File: `src/components/sections/UmbriaRecipes.tsx`

**Before (line 242):**
```typescript
const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
```

**After:**
```typescript
const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());
```

**Before (lines 332-334):**
```typescript
<Collapsible 
  open={expandedRecipe === recipe.id}
  onOpenChange={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
>
```

**After:**
```typescript
<Collapsible 
  open={expandedRecipes.has(recipe.id)}
  onOpenChange={() => {
    setExpandedRecipes(prev => {
      const next = new Set(prev);
      if (next.has(recipe.id)) {
        next.delete(recipe.id);
      } else {
        next.add(recipe.id);
      }
      return next;
    });
  }}
>
```

**Update button text logic (lines 338-348):**
```typescript
{expandedRecipes.has(recipe.id) ? (
  <>
    <ChevronUp className="h-4 w-4 mr-2" />
    Hide Full Recipe
  </>
) : (
  <>
    <ChevronDown className="h-4 w-4 mr-2" />
    View Full Recipe
  </>
)}
```

**Update category change handler (line 266):**
When switching between Rustic/Refined tabs, clear all expanded states:
```typescript
onValueChange={(v) => { 
  setActiveCategory(v as 'rustic' | 'refined'); 
  setExpandedRecipes(new Set()); // Clear all expanded when switching tabs
}}
```

## Result
- Both recipes in a category can be expanded at the same time
- Each recipe's expand/collapse is independent
- Switching between Rustic/Refined tabs still resets all expanded states (clean slate)

