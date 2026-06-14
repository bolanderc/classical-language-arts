$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifestPath = Join-Path $root "manifest-example.csv"
$outputDir = Join-Path $root "generated-portfolios"

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$rows = Import-Csv $manifestPath
$includedRows = $rows | Where-Object { $_.include_in_portfolio -eq "yes" }
$students = $includedRows | Group-Object student

foreach ($studentGroup in $students) {
  $student = $studentGroup.Name
  $term = ($studentGroup.Group | Select-Object -First 1).term
  $slug = $student.ToLower()
  $fileName = "$slug-portfolio-spring-2026.generated.md"
  $outputPath = Join-Path $outputDir $fileName

  $lines = New-Object System.Collections.Generic.List[string]
  $lines.Add("# Classical Language Arts Portfolio")
  $lines.Add("")
  $lines.Add("Student: $student")
  $lines.Add("")
  $lines.Add("Term: $term")
  $lines.Add("")
  $lines.Add("## Books Completed")
  $lines.Add("")
  $lines.Add("| Book | Work Included | Status | Completed | Parent Notes |")
  $lines.Add("|---|---|---|---|---|")

  foreach ($row in $studentGroup.Group) {
    $work = $row.portfolio_excerpt_heading -replace "^Assignment \d+: ", ""
    $lines.Add("| $($row.book) | $work | $($row.status) | $($row.completed_date) | $($row.parent_notes) |")
  }

  $lines.Add("")
  $lines.Add("## Selected Work")
  $lines.Add("")

  foreach ($row in $studentGroup.Group) {
    $sourcePath = Join-Path $root $row.source_file
    $source = Get-Content -Raw $sourcePath
    $heading = "## $($row.portfolio_excerpt_heading)"
    $work = $row.portfolio_excerpt_heading -replace "^Assignment \d+: ", ""
    $nextHeadingPattern = "(?m)^## "
    $start = $source.IndexOf($heading)

    if ($start -ge 0) {
      $excerptStart = $start + $heading.Length
      $remaining = $source.Substring($excerptStart)
      $nextMatch = [regex]::Match($remaining, $nextHeadingPattern)
      $excerpt = if ($nextMatch.Success) {
        $remaining.Substring(0, $nextMatch.Index)
      } else {
        $remaining
      }

      $excerpt = ($excerpt -split "(?m)^### Revision Checklist|^### Parent Notes")[0].Trim()
      $lines.Add("### $($row.book): $work")
      $lines.Add("")
      $lines.Add($excerpt)
      $lines.Add("")
    }
  }

  $lines.Add("## Parent Summary")
  $lines.Add("")
  $lines.Add("Strengths:")
  $lines.Add("")
  $lines.Add("Growth:")
  $lines.Add("")
  $lines.Add("Next steps:")

  Set-Content -Path $outputPath -Value $lines -Encoding UTF8
}
