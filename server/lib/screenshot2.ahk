Is64bit(){
    Return A_PtrSize = 8 ? 1 : 0
}
whatitis := is64bit()
MsgBox %whatitis% ; di xp nilai menjadi 0



VarSetCapacity(si,44)
DllCall("GetNativeSystemInfo", "uint", &si)
if ErrorLevel {
    MsgBox Windows XP or later required.
    ExitApp
}
arc := NumGet(si,0,"ushort")
MsgBox % arc=0 ? "x86" : arc=9 ? "x64" : arc=6 ? "IA64" : "UNKNOWN" ; di xp nilai menjadi x86


ThisProcess := DllCall("GetCurrentProcess")
; If IsWow64Process() fails or can not be found,
; assume this process is not running under wow64.
; Otherwise, use the value returned in IsWow64Process.
if !DllCall("IsWow64Process", "uint", ThisProcess, "int*", IsWow64Process)
    IsWow64Process := false
MsgBox % IsWow64Process ? "win64" : "win32" ; di xp nilai menjadi win32



IfNotExist %A_ScriptDir%\screenshots
    FileCreateDir %A_ScriptDir%\screenshots
	
file := A_ScriptDir "\Screenshots\" "tmp" ".png"
screen :=  "0|0|" . A_ScreenWidth . "|" . A_ScreenHeight ; X|Y|W|H
Screenshot(file,screen)

Screenshot(outfile, screen) ; Save screenshot from defined coordinates.
{
   ; pToken := Gdip_Startup()
   ; raster := 0x40000000 + 0x00CC0020
   ; pBitmap := Gdip_BitmapFromScreen(screen,raster)
   ; Gdip_SaveBitmapToFile(pBitmap, outfile, 100)
   ; Gdip_DisposeImage(pBitmap)
   ; Gdip_Shutdown(pToken)
}