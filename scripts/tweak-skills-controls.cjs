const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'components', 'SkillsSection.tsx');
let s = fs.readFileSync(file, 'utf8');
const original = s;

// 1) Make search + pills visually consistent (slightly shorter)
s = s.replace(
  "className={cn('w-full h-12 pl-11 pr-12 text-sm sm:text-base bg-background/50 rounded-xl border-2 border-transparent transition-all duration-300 placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:bg-background/80')}",
  "className={cn('w-full h-11 pl-11 pr-12 text-sm sm:text-base bg-background/50 rounded-xl border-2 border-transparent transition-all duration-300 placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:bg-background/80')}",
);

// 2) Replace the filters wrapper with a card + horizontally-scrollable chip row on mobile.
const oldOpen = '<div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">';
const newOpen =
  '<div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-primary/20 p-1.5 shadow-xl">\n' +
  '              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap px-1 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">';

if (!s.includes(oldOpen)) {
  console.error('Could not find filters wrapper open tag');
  process.exit(2);
}
s = s.replace(oldOpen, newOpen);

// Close the extra wrapper by anchoring on the known end of the block
const closeNeedle = '            </div>\n          </div>\n        </motion.div>';
const closeReplacement = '              </div>\n            </div>\n          </div>\n        </motion.div>';
if (!s.includes(closeNeedle)) {
  console.error('Could not find filters wrapper close anchor');
  process.exit(3);
}
s = s.replace(closeNeedle, closeReplacement);

// 3) Tighten chip sizing (h-11, responsive padding)
s = s.replaceAll(
  "inline-flex items-center gap-2 h-12 px-4 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap",
  "inline-flex items-center gap-2 h-11 px-3 sm:px-4 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap",
);

if (s === original) {
  console.error('No changes applied');
  process.exit(1);
}

fs.writeFileSync(file, s, 'utf8');
console.log('Tweaked skills controls:', path.relative(process.cwd(), file));
