const fs = require('fs');
const p = '/Users/meilanasapta/Code/giwangan-web-gen/web/app/dashboard/sites/[id]/page.tsx';
let lines = fs.readFileSync(p, 'utf8').split('\n');

// Find the line that is "        </div>" which closes the RIGHT CANVAS
// It comes right after "          </div>" (closes mobile bottom sheet)
// and is immediately followed by "          {/* Desktop sticky publish footer"

// Find the sticky footer comment line
const footerCommentIdx = lines.findIndex(l => l.trim() === '{/* Desktop sticky publish footer — inside canvas, desktop only */}');
if (footerCommentIdx === -1) {
  console.error('Footer comment not found');
  // print lines around where it should be
  lines.slice(3240, 3250).forEach((l, i) => console.log(3241+i, JSON.stringify(l)));
  process.exit(1);
}
console.log('Footer comment at line:', footerCommentIdx + 1);

// The line 2 above it should be "        </div>" (right canvas close)
// We need to move that closing div to AFTER the sticky footer </div>
// Line footerCommentIdx - 1 is a blank line
// Line footerCommentIdx - 2 is "        </div>" — the right canvas close

const rightCanvasCloseIdx = footerCommentIdx - 2;
const closingLine = lines[rightCanvasCloseIdx];
console.log('Right canvas close line:', rightCanvasCloseIdx + 1, JSON.stringify(closingLine));

if (closingLine.trim() !== '</div>') {
  console.error('Not a closing div:', closingLine);
  process.exit(1);
}

// Remove the right canvas closing div from its current position
lines.splice(rightCanvasCloseIdx, 1);

// Find the new position of the footer's closing </div> (now 1 line earlier)
// The sticky footer ends with: "          </div>" then "        </div>" (right canvas)
// We need to insert the right canvas close AFTER the footer's own </div>

// Find "        </div>" that closes the sticky footer block
// after footerCommentIdx (now shifted by -1 due to splice)
const newFooterCommentIdx = footerCommentIdx - 1;
let footerEndIdx = -1;
for (let i = newFooterCommentIdx; i < Math.min(newFooterCommentIdx + 80, lines.length); i++) {
  if (lines[i].trim() === '</div>' && lines[i].startsWith('          </div>')) {
    footerEndIdx = i;
    break;
  }
}
console.log('Footer end at line:', footerEndIdx + 1, JSON.stringify(lines[footerEndIdx]));

// Insert the right canvas closing </div> AFTER the footer's </div>
lines.splice(footerEndIdx + 1, 0, closingLine);

fs.writeFileSync(p, lines.join('\n'), 'utf8');
console.log('Done. Lines:', lines.length);
