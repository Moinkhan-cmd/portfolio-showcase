const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'components', 'SkillsSection.tsx');
let s = fs.readFileSync(file, 'utf8');
const original = s;

// Remove the accidental extra closing </motion.div>
s = s.replace(/\n\s*<\/motion\.div>\n\s*<\/motion\.div>\n\s*\{isLoading \? \(/m, '\n        </motion.div>\n        {isLoading ? (');

// Fix quoted empty-state text
s = s.replace(
  /<p className="text-sm text-muted-foreground\/60 mt-2">'Check back soon!'<\/p>/g,
  '<p className="text-sm text-muted-foreground/60 mt-2">Check back soon!</p>'
);

if (s === original) {
  console.error('No changes applied');
  process.exit(1);
}

fs.writeFileSync(file, s, 'utf8');
console.log('Fixed JSX after search removal:', path.relative(process.cwd(), file));
