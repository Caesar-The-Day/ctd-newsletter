
# Redesign: Umbria Festival Calendar Layout

## Problems Identified

1. **Truncated Names**: Line 402 uses `festival.name.split(' ')[0]` which shows only the first word ("Umbria" instead of "Umbria Jazz Winter", "Sagra" for all sagre)

2. **Count Discrepancy**: The calendar shows duplicate entries because festivals spanning multiple months (e.g., "Festival dei Due Mondi" has `monthIndices: [5, 6]`) appear in each month. This inflates the visual count vs. the actual array length.

3. **"+N more" not clickable**: Users can't access hidden festivals in months with 4+ events

4. **Space Constraints**: 4-column grid with small boxes can't display full names

## Solution: Redesigned Timeline Layout

Replace the cramped month grid with a **vertical timeline layout** that:
- Shows full festival names
- Groups festivals by quarter/season
- Eliminates duplicate counting confusion
- Makes all festivals accessible

## Technical Changes

### File: `src/components/sections/UmbriaFestivalCalendar.tsx`

**1. Replace Month Grid with Seasonal Timeline (lines 368-465)**

Current cramped 4-column grid becomes a 2-column seasonal layout:

```text
+------------------+------------------+
| WINTER           | SPRING           |
| Jan-Mar          | Apr-Jun          |
| - Festival 1     | - Festival 3     |
| - Festival 2     | - Festival 4     |
+------------------+------------------+
| SUMMER           | AUTUMN           |
| Jul-Sep          | Oct-Dec          |
| - Festival 5     | - Festival 7     |
| - Festival 6     | - Festival 8     |
+------------------+------------------+
```

**2. Fix Festival Name Display**

Remove the truncation logic:
```typescript
// Before (line 402):
{festival.name.split(' ')[0]}

// After:
{festival.name}
```

**3. Add Season Grouping Logic**

Create a helper to group festivals by season:
```typescript
const seasons = [
  { name: 'Winter', months: [0, 1, 2], color: 'blue' },
  { name: 'Spring', months: [3, 4, 5], color: 'green' },
  { name: 'Summer', months: [6, 7, 8], color: 'amber' },
  { name: 'Autumn', months: [9, 10, 11], color: 'orange' }
];

const getFestivalsBySeason = (seasonMonths: number[]) => {
  return currentFestivals.filter(f => 
    f.monthIndices.some(idx => seasonMonths.includes(idx))
  );
};
```

**4. New Seasonal Card Component**

Each season displays in a card with:
- Season name header with icon
- List of all festivals in that season (no truncation)
- Click any festival to see details in sidebar
- Badge showing primary month for multi-month festivals

```tsx
<div className="grid md:grid-cols-2 gap-4">
  {seasons.map(season => {
    const festivalsInSeason = getFestivalsBySeason(season.months);
    return (
      <Card key={season.name} className="p-4">
        <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
          <SeasonIcon />
          {season.name}
        </h4>
        <div className="space-y-2">
          {festivalsInSeason.map(festival => (
            <button
              key={festival.id}
              onClick={() => setSelectedFestival(festival)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${festival.color} 
                ${selectedFestival?.id === festival.id ? 'ring-2 ring-primary' : ''}`}
            >
              <span className="font-medium">{festival.name}</span>
              <span className="text-xs opacity-70 ml-2">{festival.month}</span>
            </button>
          ))}
          {festivalsInSeason.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No events this season</p>
          )}
        </div>
      </Card>
    );
  })}
</div>
```

**5. Keep Detail Sidebar (lines 417-463)**

The right-side detail panel remains unchanged - it already works well.

**6. Accurate Counts**

The tab counts already show correct numbers:
- `Major Festivals ({majorFestivals.length})` = 13
- `Food Sagre ({foodSagre.length})` = 7

This matches the list view. The redesign eliminates visual confusion.

## Visual Layout

```text
+-----------------------------------------------+------------------+
|  CALENDAR VIEW                                |  DETAIL PANEL    |
|                                               |                  |
|  +-------------------+  +-------------------+ |  [Festival Image]|
|  | ❄️ WINTER         |  | 🌷 SPRING         | |                  |
|  | Jan–Mar           |  | Apr–Jun           | |  Festival Name   |
|  |                   |  |                   | |  Location · Date |
|  | [Umbria Jazz Win] |  | [Calendimaggio  ] | |                  |
|  |                   |  | [Corsa dei Ceri ] | |  Description...  |
|  |                   |  | [Infiorata      ] | |                  |
|  |                   |  | [Chroma Festival] | |  "Why Go" quote  |
|  |                   |  | [Perugia 1416   ] | |                  |
|  +-------------------+  | [Spoleto        ] | |  [Website Link]  |
|                         +-------------------+ |                  |
|  +-------------------+  +-------------------+ |                  |
|  | ☀️ SUMMER         |  | 🍂 AUTUMN         | |                  |
|  | Jul–Sep           |  | Oct–Dec           | |                  |
|  |                   |  |                   | |                  |
|  | [Umbria Jazz Sum] |  | [Truffle Market ] | |                  |
|  | [Trasimeno Blues] |  | [Eurochocolate  ] | |                  |
|  | [Montelago Celtic]|  |                   | |                  |
|  | [Festival Medioev]|  |                   | |                  |
|  +-------------------+  +-------------------+ |                  |
+-----------------------------------------------+------------------+
```

## Benefits

1. **Full names visible** - No more truncation
2. **Accurate counts** - Each festival appears once per season, matching list view
3. **All festivals accessible** - No hidden "+N more" items
4. **Cleaner visual hierarchy** - Seasons group logically
5. **Mobile-friendly** - Stacks to single column naturally
6. **Click any festival** - All events are interactive buttons

## Alternative: Compact Pills with Tooltip

If the user prefers keeping a month-based view, we could:
- Use 2-letter abbreviations with full name in tooltip
- Show festival icons instead of text
- Add a hover popover for quick preview

But the seasonal redesign is recommended for clarity.
