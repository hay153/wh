Add-Type -AssemblyName System.Net.Http
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8888/')
$listener.Start()
Write-Host 'Server started on http://localhost:8888/'
$mime = @{
    '.html'='text/html; charset=utf-8'
    '.js'='application/javascript; charset=utf-8'
    '.css'='text/css; charset=utf-8'
    '.json'='application/json'
    '.png'='image/png'
    '.jpg'='image/jpeg'
    '.jpeg'='image/jpeg'
    '.webp'='image/webp'
    '.gif'='image/gif'
}
$root = 'c:\Users\2-507\Desktop\1'
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $localPath = $request.Url.LocalPath
        if ($localPath -eq '/') { $localPath = '/index.html' }
        $filePath = Join-Path $root $localPath.TrimStart('/')
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $response.ContentType = $mime[$ext]
            if (-not $response.ContentType) { $response.ContentType = 'application/octet-stream' }
            $response.OutputStream.Write($content, 0, $content.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes('Not Found: ' + $localPath)
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        Write-Host $_.Exception.Message
    }
}
