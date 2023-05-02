import { useState } from "react";

export default function useDebouncedTrigger() {
    const [triggered, setTrigger] = useState(false)

    function initDebounce() {
        setTrigger(false);
        startTimer();    
    }

    async function startTimer() {
        await new Promise(res => setTimeout(res, 350))
        setTrigger(true)
    }

    return {triggered, initDebounce}
}