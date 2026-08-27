const headers=[{key:'Content-Security-Policy',value:"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"},{key:'Referrer-Policy',value:'no-referrer'},{key:'X-Content-Type-Options',value:'nosniff'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'}]
const config={poweredByHeader:false,turbopack:{root:import.meta.dirname},async headers(){return[{source:'/(.*)',headers}]}}
export default config
