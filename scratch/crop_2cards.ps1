[Reflection.Assembly]::LoadWithPartialName('System.Drawing') | Out-Null
$src = [System.Drawing.Image]::FromFile('C:\Users\avdp1\.gemini\antigravity\brain\c7df19d8-966e-4cbc-91d1-26d55021bd65\.user_uploaded\media_1793272062564_333f1809.png')

# Card 1 is roughly from x: 22, y: 15 to x: 185, y: 200
# Card 2 is roughly from x: 195, y: 40 to x: 335, y: 175

function Crop-Exact($x, $y, $w, $h, $name) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $srcRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
  $g.DrawImage($src, 0, 0, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $bmp.Save("C:\Users\avdp1\.gemini\antigravity\brain\c7df19d8-966e-4cbc-91d1-26d55021bd65\$name.png")
  $bmp.Dispose()
}

Crop-Exact 20 10 170 195 "exact_card1"
Crop-Exact 190 35 150 145 "exact_card2"
Write-Host "CROPPED_EXACT"

