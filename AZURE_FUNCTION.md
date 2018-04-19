# Azure function

## Setup

Setup a PowerShell Function (experimental feature at the time of writing)

## Code

    # POST method: $req
    $requestBody = Get-Content $req -Raw | ConvertFrom-Json
    $dataFile = "d:\local\temp\data.json"
    
    function normalize {
        Param([Int32]$Value, [Int32]$Calibration)
    
        return [Math]::Asin([Math]::Min(1.0, $Value / $Calibration))
    }
    
    if ($REQ_METHOD -eq "GET") 
    {
    } 
    else
    {
        $method = "POST"
        $requestBody.x = Normalize $requestBody.x  282
        $requestBody.y = Normalize $requestBody.y  260
        $requestBody.z = Normalize $requestBody.z  252
    
        Out-File -FilePath $dataFile -InputObject ($requestBody | ConvertTo-Json)
    
    }
    $result = Get-Content -raw $dataFile | ConvertFrom-Json
    Out-File -Encoding Ascii -FilePath $res `
        -inputObject ($result| ConvertTo-Json)


Use the URL in the JavaScript (with or without authentication)
