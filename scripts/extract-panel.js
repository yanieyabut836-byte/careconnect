const fs = require('fs')
const path = require('path')

const inputPath = path.join(__dirname, '..', 'public', 'image', 'login.svg')
const outputPath = path.join(__dirname, '..', 'public', 'image', 'login-panel.svg')

const content = fs.readFileSync(inputPath, 'utf8')
const lines = content.split(/\r?\n/)

const header = '<svg width="597" height="1024" viewBox="0 0 597 1024" fill="none" xmlns="http://www.w3.org/2000/svg">'
// In login.svg:
// line 1 is <svg ...>
// line 2 is <rect width="1440" height="1024" fill="white"/>
// line 3 is <rect width="597" height="1024" fill="#0D2352"/>
// line 4, 5, 6 is the logo
// line 7 is CareConnect text
// line 8 is Your Health, Our priority text
// line 9, 10, 11, 12 is the monitor illustration
// line 13 is Secure Access text
// line 14 is Please login to continue... text
const leftElements = lines.slice(2, 14).join('\n')

// Gradients:
// Find <linearGradient id="paint0_linear_3_388" ... </linearGradient> etc.
const defsStart = lines.findIndex(l => l.includes('id="paint0_linear_3_388"'))
const defsEnd = lines.findIndex(l => l.includes('</defs>'))

let defsContent = ''
if (defsStart !== -1 && defsEnd !== -1) {
  defsContent = '<defs>\n' + lines.slice(defsStart, defsEnd).join('\n') + '\n</defs>'
} else {
  // Grab lines around 54 to 70
  defsContent = '<defs>\n' + lines.slice(54, 70).join('\n') + '\n</defs>'
}

const finalSvg = [header, leftElements, defsContent, '</svg>'].join('\n')
fs.writeFileSync(outputPath, finalSvg)
console.log('Successfully written login-panel.svg, size:', finalSvg.length)
