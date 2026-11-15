[Reflection.Assembly]::LoadWithPartialName('System.Drawing') | Out-Null
$src = [System.Drawing.Image]::FromFile('C:\Users\avdp1\.gemini\antigravity\brain\c7df19d8-966e-4cbc-91d1-26d55021bd65\.user_uploaded\media_1793269012533_1340f6cf.jpg')

function Crop-Save($x, $y, $w, $h, $name) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $srcRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
  $g.DrawImage($src, 0, 0, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $bmp.Save("C:\Users\avdp1\.gemini\antigravity\brain\c7df19d8-966e-4cbc-91d1-26d55021bd65\$name.png")
  $bmp.Dispose()
}

Crop-Save 10 20 180 200 "ref_card_1"
Crop-Save 180 30 160 180 "ref_card_2"
Crop-Save 330 40 150 170 "ref_card_3"
Crop-Save 475 35 150 175 "ref_card_4"
Crop-Save 620 20 185 200 "ref_card_5"
Write-Host "ALL_SAVED"

