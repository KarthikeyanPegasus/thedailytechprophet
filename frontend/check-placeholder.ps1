Get-ChildItem -Path '.next' -Recurse -Filter '*.js' | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match 'PLACEHOLDER') {
        Write-Host "Found placeholder in: $($_.FullName)"
    }
}
