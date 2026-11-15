// Test harness to render FooterWave on a canvas in node using headless Edge and capture screenshot
const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
// We will launch Edge on a local file or test HTML

