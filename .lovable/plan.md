
# Umbria Chocolate City Updates

## Summary
Three updates to the UmbriaChocolateCity component:
1. Update Eurochocolate dates to November 13-22, 2026
2. Replace Baci image with the italco.com product shot
3. Add whimsical kiss/heart animations to the "Unwrap a Bacio" button

---

## 1. Update Eurochocolate Festival Dates

**Current (line 203-207):**
```text
📅 Next Edition: October 18–27, 2025
Free entry · 150+ exhibitors · Corso Vannucci & surrounding streets
```

**Updated:**
```text
📅 Next Edition: November 13–22, 2026
Free entry · 150+ exhibitors · Corso Vannucci & surrounding streets
```

Also update the intro description (line 198-200) to mention "November" instead of "October":
```text
Every November, Perugia transforms into chocolate heaven...
```

---

## 2. Replace Baci Image

**Action:** Download the Baci product image from italco.com and save it to `src/assets/umbria/baci-chocolate.jpg`, replacing the existing AI-generated image.

The new image shows the iconic silver Baci Perugina packaging with stars, which is more recognizable than a generic chocolate photo.

---

## 3. Add Whimsical Kiss/Heart Animation to "Unwrap a Bacio"

This is the creative part. I'll add floating heart particles that burst out when the button is clicked, inspired by:
- The Panettone Quiz's SnowParticles component style
- The NorciaTable's seasonal emoji icons (🌸, ☀️, 🍂, ❄️)

### Animation Concept: "Kiss Burst"
When the user clicks "Unwrap a Bacio":
1. **During unwrapping (1.5s):** A silver foil "shimmer" animation plays on the button
2. **On reveal:** 12-15 floating heart particles burst outward in a radial pattern, then drift upward and fade
3. **Love note appears:** With a gentle scale-in animation

### New Keyframes (tailwind.config.ts)
```typescript
"kiss-burst": {
  "0%": { transform: "scale(0) translateY(0)", opacity: "1" },
  "50%": { transform: "scale(1.2) translateY(-20px)", opacity: "0.8" },
  "100%": { transform: "scale(0.8) translateY(-60px)", opacity: "0" }
},
"foil-shimmer": {
  "0%": { backgroundPosition: "-200% 0" },
  "100%": { backgroundPosition: "200% 0" }
}
```

### Heart Symbols
Using the Unicode heart variants that match the Butcher's Table icon style:
- `💋` (kiss mark - the key one!)
- `♥` (solid heart)
- `💕` (two hearts)
- `✨` (sparkle)

### Component Changes (UmbriaChocolateCity.tsx)
1. Add a new `KissParticles` component that renders 12-15 floating symbols
2. Trigger particles when `isUnwrapping` becomes true
3. Add silver shimmer gradient to button during unwrap state
4. Hearts burst from button center, drift upward, and fade over 2 seconds

### Visual Effect
```text
      💋      ♥
   ♥    ✨   💕
     💋   ♥
  ✨        💋
   ♥   💕   ✨
    [Unwrap a Bacio]
```

---

## Technical Implementation

### Files to Modify
| File | Changes |
|------|---------|
| `tailwind.config.ts` | Add `kiss-burst` and `foil-shimmer` keyframes |
| `src/assets/umbria/baci-chocolate.jpg` | Replace with italco.com product image |
| `src/components/sections/UmbriaChocolateCity.tsx` | Add KissParticles, update dates, shimmer effect |

### UmbriaChocolateCity Changes

**New State:**
```typescript
const [showParticles, setShowParticles] = useState(false);
```

**New KissParticles Component:**
```typescript
const KissParticles = ({ isActive }: { isActive: boolean }) => {
  const particles = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      symbol: ['💋', '♥', '💕', '✨'][Math.floor(Math.random() * 4)],
      angle: (i / 15) * 360,
      delay: Math.random() * 0.3,
      distance: 40 + Math.random() * 60,
    })), []
  );

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute left-1/2 top-1/2 animate-kiss-burst"
          style={{
            transform: `rotate(${p.angle}deg) translateY(-${p.distance}px)`,
            animationDelay: `${p.delay}s`,
            fontSize: '16px',
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
};
```

**Updated Button:**
```tsx
<Button 
  onClick={unwrapBacio} 
  disabled={isUnwrapping}
  className={`
    relative overflow-hidden
    bg-gradient-to-r from-amber-600 to-rose-600 
    hover:from-amber-700 hover:to-rose-700
    ${isUnwrapping ? 'animate-shimmer' : ''}
  `}
>
  <KissParticles isActive={showParticles} />
  {isUnwrapping ? (
    <span className="animate-pulse">Unwrapping...</span>
  ) : (
    <>
      <Heart className="h-4 w-4 mr-2" />
      Unwrap a Bacio
    </>
  )}
</Button>
```

---

## Summary of Deliverables

1. **Eurochocolate dates updated** to November 13-22, 2026 in both locations
2. **Baci product photo** replaced with authentic packaging image
3. **Kiss burst animation** with 15 floating heart/kiss particles on button click
4. **Foil shimmer effect** on button during the 1.5s unwrap delay
5. **Icon change** from Gift to Heart on button to match the "kiss" theme

