import { useEffect, useState, useRef } from 'react'
import { motion } from "motion/react"
import { ChevronUp } from "react-feather";
import { useTypewriter } from '../hooks/useTypewriter';
  
export function ContentBlock({ content, showBody, showRig, setShowBody, setShowRig }) {
    const [open, setOpen] = useState(false)
    const [contentHeight, setContentHeight] = useState(0)
    const contentRef = useRef(null)
    const { output } = useTypewriter({ content, isActive: open })

    useEffect(() => {
        if (!contentRef.current) return

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setContentHeight(entry.contentRect.height)
            }
        })

        resizeObserver.observe(contentRef.current)

        return () => {
            resizeObserver.disconnect()
        }
    }, [content])

    return (
        <>
            <motion.div 
                className='bottom-[calc(env(safe-area-inset-bottom)+0px)]
    md:static md:block'
                initial={{ y: -contentHeight }} 
                animate={{ y: open ? -contentHeight : 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                    mass: 0.7,
                }}
            >
                <motion.button 
                    onTap={() => setOpen((prev) => !prev)}
                    whileTap={{ scale: 0.95 }}
                    className="mx-auto block rounded-t-xl py-1 px-6 border border-1.5 border-zinc-600 bg-zinc-800/20 backdrop-blur-[3px]"
                >
                    <ChevronUp size={24} color="white" strokeWidth={1.5} />
                </motion.button>

                <div 
                    ref={contentRef}
                    className='absolute flex flex-col w-[min(24rem,calc(100vw-2rem))]
                        left-1/2 transform -translate-x-1/2 
                        border border-1.5 border-zinc-600 
                        bg-zinc-800/20 backdrop-blur-[3px]
                        gap-4 p-4
                        rounded-t-xl'
                >
                    <div className='flex relative gap-2 justify-center'>          
                        {/* Show Skeleton View */}
                        <button
                        onClick={() => setShowBody(!showBody)}
                        className="toggle-button"
                        >
                        {showBody ? 'skeleton' : 'body'}
                        </button>
                        
                        {/* Show Rig View */}
                        <button
                        onClick={() => setShowRig(!showRig)}
                        className="toggle-button"
                        >
                        {showRig ? 'no rig' : 'rig'}
                        </button>
                    </div>
                    
                    <p className='text-white pb-12 content'>{output}</p>
                </div>
            </motion.div>
        </>
    )
}

export default ContentBlock