$appRootPath = "D:\Programming\node\kaguwa-ngn"

$servicePaths = @(
    "$appRootPath\user-service\index.js",
    "$appRootPath\auth-service\index.js"
    "$appRootPath\gateway-service\index.js"
)


foreach ($servicePath in $servicePaths) {
    code (Split-Path $servicePath)
    #Start-Process powershell.exe -LoadUserProfile -ArgumentList "node", $servicePath
    #Start-Sleep -Seconds 1
}