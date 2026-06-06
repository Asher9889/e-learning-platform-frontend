import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // 1. Initial state window size ke according set karein (handle SSR)
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    // 2. Sirf resize event ka listener add karein
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    window.addEventListener("resize", handleResize)
    
    // 3. Cleanup function zaroori hai
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}