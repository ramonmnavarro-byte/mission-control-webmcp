import type { Metadata, Viewport } from 'next'
import './globals.css'
import './enhancements.css'
import './scheduled-report.css'

export const metadata:Metadata={title:'Mission Control WebMCP Demo',description:'Fictional public-safe WebMCP operations demo.'}
export const viewport:Viewport={colorScheme:'dark',themeColor:'#070a0d'}
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
