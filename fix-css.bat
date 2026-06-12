@echo off
setlocal enabledelayedexpansion
set "file=D:\my projects\mywebsite\src\app\globals.css"

echo. >> "%file%"
echo /* == Header nav + icon colors == */ >> "%file%"
echo header nav a { color: #374151 !important; } >> "%file%"
echo header nav a:hover { color: #111827 !important; } >> "%file%"
echo header button[aria-label] { color: #374151 !important; } >> "%file%"
echo header button[aria-label]:hover { color: #111827 !important; } >> "%file%"
echo header a[aria-label] { color: #374151 !important; } >> "%file%"
echo header a[aria-label]:hover { color: #111827 !important; } >> "%file%"

echo Done
