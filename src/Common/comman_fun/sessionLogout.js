import { useEffect, useRef } from 'react'

const useSessionTimeout = (
    onTimeout,
    timeoutDuration = 300000, // 5 minutes
    warningDuration = 60000, // 1 minute before timeout
    onWarning,
) => {
    const timeoutRef = useRef(null)
    const warningRef = useRef(null)

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        if (warningRef.current) {
            clearTimeout(warningRef.current)
        }

        if (onWarning) {
            warningRef.current = setTimeout(
                onWarning,
                timeoutDuration - warningDuration,
            )
        }
        timeoutRef.current = setTimeout(onTimeout, timeoutDuration)
    }

    useEffect(() => {
        const handleUserActivity = () => {
            resetTimeout()
        }

        window.addEventListener('mousemove', handleUserActivity)
        window.addEventListener('keypress', handleUserActivity)
        window.addEventListener('click', handleUserActivity)

        resetTimeout()

        return () => {
            clearTimeout(timeoutRef.current)
            clearTimeout(warningRef.current)
            window.removeEventListener('mousemove', handleUserActivity)
            window.removeEventListener('keypress', handleUserActivity)
            window.removeEventListener('click', handleUserActivity)
        }
    }, [])

    return resetTimeout
}

export default useSessionTimeout
