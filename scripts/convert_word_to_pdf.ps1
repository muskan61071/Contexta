$baseDir = "c:\Users\ladyy\OneDrive\context-aware-ambiguity-system"
$docxPath = Join-Path $baseDir "Contexta_Project_Report.docx"
$pdfPath = Join-Path $baseDir "Contexta_Project_Report.pdf"

Write-Output "Starting Word PDF conversion with alerts suppressed..."
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $doc = $word.Documents.Open($docxPath, $false, $true)
    $doc.ExportAsFixedFormat($pdfPath, 17)
    $doc.Close(0)
    $word.Quit(0)
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($doc) | Out-Null
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
    Write-Output "Successfully exported: $pdfPath"
} catch {
    Write-Output "Error: $_"
}
