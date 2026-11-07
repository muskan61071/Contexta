$baseDir = "c:\Users\ladyy\OneDrive\context-aware-ambiguity-system"
$docxPath = Join-Path $baseDir "Contexta_Project_Report.docx"
$reportPdfPath = Join-Path $baseDir "Contexta_Project_Report.pdf"

Write-Output "Converting Word Document to PDF..."
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc = $word.Documents.Open($docxPath)
    
    # 17 = wdExportFormatPDF / wdFormatPDF
    # Using ExportAsFixedFormat
    $doc.ExportAsFixedFormat($reportPdfPath, 17)
    
    $doc.Close([ref]$false)
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    Write-Output "Successfully generated: $reportPdfPath"
} catch {
    Write-Output "Word conversion error: $_"
}
