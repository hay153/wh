$content = Get-Content 'c:\Users\2-507\Desktop\1\js\game-puzzle.js' -Raw
try {
    $null = [scriptblock]::Create($content)
    Write-Host 'OK - game-puzzle.js 语法正确'
} catch {
    Write-Host '语法错误:' $_.Exception.Message
}

$content2 = Get-Content 'c:\Users\2-507\Desktop\1\js\main.js' -Raw
try {
    $null = [scriptblock]::Create($content2)
    Write-Host 'OK - main.js 语法正确'
} catch {
    Write-Host '语法错误:' $_.Exception.Message
}
