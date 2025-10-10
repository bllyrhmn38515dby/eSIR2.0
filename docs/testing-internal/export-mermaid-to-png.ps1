# Requires: Node.js and mermaid-cli (install: npm i -g @mermaid-js/mermaid-cli)
param(
  [string]$InputDir = ".",
  [string]$OutDir = "./png"
)

if (!(Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

$mmdFiles = Get-ChildItem -Path $InputDir -Filter *.mmd -Recurse

if ($mmdFiles.Count -eq 0) {
  Write-Host "No .mmd files found in $InputDir" -ForegroundColor Yellow
  exit 0
}

foreach ($file in $mmdFiles) {
  $outFile = Join-Path $OutDir ($file.BaseName + ".png")
  Write-Host "Exporting $($file.FullName) -> $outFile"
  mmdc -i $file.FullName -o $outFile --backgroundColor "#ffffff" --scale 1.25
}

Write-Host "Done. PNGs in: $((Resolve-Path $OutDir).Path)" -ForegroundColor Green


