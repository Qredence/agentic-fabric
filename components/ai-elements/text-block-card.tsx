'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Handle, Position } from '@xyflow/react';
import {
  Info,
  ClipboardCopy,
  Merge,
  Plus,
  Image,
  Video,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import type { TextBlockNodeData } from '@/lib/workflow/types';

type TextBlockCardProps = Omit<TextBlockNodeData, 'variant' | 'handles'> & {
  onTextChange?: (text: string) => void;
  isSelected?: boolean;
  isHovered?: boolean;
  onToggleCollapse?: () => void;
  'data-id'?: string;
};

export const TextBlockCard: React.FC<TextBlockCardProps> = ({
  title = 'Text',
  model = 'GPT-5',
  placeholder = 'Try "A script excerpt of a romantic meeting in Paris"',
  onTextChange,
  showSuggestions = true,
  isSelected = false,
  isHovered = false,
  collapsed = false,
  onToggleCollapse,
  'data-id': dataId,
}) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [internalHovered, setInternalHovered] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(collapsed);

  useEffect(() => {
    setInternalCollapsed(collapsed);
  }, [collapsed]);

  const hovered = isHovered || internalHovered;
  const isCollapsed = internalCollapsed;

  const suggestions = [
    {
      icon: ClipboardCopy,
      label: 'Write or paste text',
    },
    {
      icon: Merge,
      label: 'Combine ideas',
    },
    {
      icon: Plus,
      label: 'Elaborate',
    },
    {
      icon: Image,
      label: 'Ask a question about an image',
    },
    {
      icon: Video,
      label: 'Turn text into a video',
    },
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange?.(newText);
  };

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const springTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  };

  return (
    <motion.div
      layout
      transition={springTransition}
      className="w-[352px]"
      data-id={dataId}
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
    >
      {/* Collapsed State */}
      {isCollapsed ? (
        <motion.button
          aria-label={`Expand ${title}`}
          layoutId={`node-${dataId || title}`}
          onClick={toggleCollapse}
          initial={{
            scale: 0.95,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0.95,
            opacity: 0,
          }}
          transition={springTransition}
          className={`
            w-full px-4 py-3 rounded-2xl
            bg-[rgba(32,32,32,0.9)] backdrop-blur-2xl
            border transition-all duration-200
            ${
              isSelected
                ? 'border-blue-500/50 ring-2 ring-blue-500/20'
                : hovered
                  ? 'border-white/10'
                  : 'border-white/5'
            }
            hover:border-white/15 active:scale-98
            flex items-center justify-between
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              layoutId={`node-title-${dataId || title}`}
              transition={springTransition}
              className="text-base text-gray-300 truncate"
            >
              {title}
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                x: -10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                ...springTransition,
                delay: 0.1,
              }}
              className="text-xs text-gray-600"
            >
              {model}
            </motion.div>
          </div>
          <motion.div
            initial={{
              rotate: 180,
              opacity: 0,
            }}
            animate={{
              rotate: 0,
              opacity: 1,
            }}
            transition={springTransition}
          >
            <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
          </motion.div>
        </motion.button>
      ) : (
        <>
          {/* Header */}
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={springTransition}
            className="mb-2 px-0"
          >
            <div className="grid grid-cols-[1fr_auto] items-center gap-3">
              <div className="min-w-0">
                <motion.div
                  layoutId={`node-title-${dataId || title}`}
                  transition={springTransition}
                  className={`text-[24px] leading-[30px] truncate transition-colors duration-200 ${
                    hovered ? 'text-gray-300' : 'text-gray-400'
                  }`}
                >
                  {title}
                </motion.div>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{
                    opacity: 0,
                    x: 10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    ...springTransition,
                    delay: 0.05,
                  }}
                  className="text-sm text-gray-600 truncate max-w-[120px]"
                >
                  {model}
                </motion.div>
                <motion.button
                  aria-label={`Collapse ${title}`}
                  onClick={toggleCollapse}
                  whileHover={{
                    scale: 1.1,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  transition={springTransition}
                  className="p-1 rounded hover:bg-white/5 transition-colors"
                >
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                </motion.button>
              </div>
            </div>
          </motion.div>
          {/* Card */}
          <motion.div
            layoutId={`node-${dataId || title}`}
            className="relative"
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              ...springTransition,
              opacity: {
                duration: 0.2,
              },
            }}
          >
            <motion.div
              initial={{
                borderRadius: 16,
              }}
              animate={{
                borderRadius: 16,
              }}
              transition={springTransition}
              className={`
                relative h-[352px] w-[352px] rounded-2xl
                bg-[rgba(32,32,32,0.9)] backdrop-blur-2xl
                border transition-all duration-200
                ${
                  isSelected
                    ? 'border-blue-500/50 ring-2 ring-blue-500/20'
                    : hovered
                      ? 'border-white/10'
                      : 'border-white/5'
                }
                ${isFocused ? 'ring-1 ring-white/10' : ''}
              `}
            >
              <div className="flex flex-col h-full rounded-2xl overflow-hidden">
                {/* Content Area */}
                <div className="relative flex-1 flex flex-col overflow-hidden">
                  {/* Empty State with Suggestions */}
                  <AnimatePresence mode="wait">
                    {showSuggestions && !text && !isFocused && (
                      <motion.div
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                      >
                        {/* Info Banner */}
                        <motion.div
                          initial={{
                            y: -10,
                            opacity: 0,
                          }}
                          animate={{
                            y: 0,
                            opacity: 1,
                          }}
                          transition={{
                            ...springTransition,
                            delay: 0.1,
                          }}
                          onClick={toggleCollapse}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors duration-200"
                        >
                          <button className="flex items-center gap-3 text-gray-600 hover:text-gray-400 transition-colors duration-300">
                            <Info className="h-3.5 w-3.5" />
                            <p className="text-xs leading-[16.5px] -tracking-[0.16px]">
                              Learn about Text Blocks
                            </p>
                          </button>
                        </motion.div>
                        <hr className="border-t border-[rgb(41,47,53)]" />
                        {/* Suggestions */}
                        <div className="flex items-center justify-center h-[260px]">
                          <div className="flex-1 flex flex-col justify-center gap-4 px-6">
                            <div className="flex flex-col gap-3">
                              {suggestions.map((suggestion, index) => {
                                const Icon = suggestion.icon;
                                return (
                                  <motion.button
                                    key={index}
                                    initial={{
                                      opacity: 0,
                                      x: -20,
                                    }}
                                    animate={{
                                      opacity: 1,
                                      x: 0,
                                    }}
                                    transition={{
                                      ...springTransition,
                                      delay: 0.2 + index * 0.05,
                                    }}
                                    whileHover={{
                                      x: 4,
                                      scale: 1.02,
                                    }}
                                    whileTap={{
                                      scale: 0.98,
                                    }}
                                    className="flex items-center gap-1 p-0.5 rounded text-gray-400 hover:text-gray-300 hover:bg-white/5 transition-all duration-200"
                                  >
                                    <Icon className="h-3 w-3" />
                                    <span className="text-xs leading-[16.5px] -tracking-[0.16px]">
                                      {suggestion.label}
                                    </span>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Text Editor */}
                  {(text || isFocused || !showSuggestions) && (
                    <motion.textarea
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      value={text}
                      onChange={handleTextChange}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder=""
                      className="flex-1 w-full resize-none overflow-y-auto wrap-break-word
                        bg-transparent text-white text-sm leading-[19.25px] -tracking-[0.32px]
                        p-3 pb-40 outline-none
                        placeholder:text-gray-600"
                    />
                  )}
                  {/* Bottom Input Area */}
                  <motion.div
                    initial={{
                      y: 20,
                      opacity: 0,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    transition={{
                      ...springTransition,
                      delay: 0.15,
                    }}
                    className="absolute bottom-0 left-0 w-full flex flex-col overflow-hidden rounded-b-2xl transition-all duration-300"
                  >
                    <div className="relative max-h-36 w-full flex flex-col-reverse overflow-hidden rounded-b-2xl bg-[rgba(32,32,32,0.9)] border-t border-white/5">
                      <div className="h-auto min-h-0 overflow-auto p-3">
                        {/* Animated Placeholder */}
                        {!text && (
                          <div className="pointer-events-none absolute bottom-3 left-0 flex h-8 w-full gap-3 px-3 pr-14">
                            <span className="w-[284px] overflow-hidden text-sm leading-[19.25px] -tracking-[0.32px] bg-gradient-to-r from-gray-600 via-white to-gray-600 bg-clip-text text-transparent animate-shimmer">
                              {placeholder}
                            </span>
                          </div>
                        )}
                        {/* Input Grid */}
                        <div className="inline-grid align-top text-sm leading-4 items-stretch relative w-full pr-9 pt-4">
                          <textarea
                            rows={1}
                            className="h-auto w-full overflow-hidden align-bottom resize-none min-h-0 bg-transparent text-white text-sm leading-4 -tracking-[0.32px] outline-none border-none p-0 m-0"
                            style={{
                              gridArea: '1 / 1 / auto / auto',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            {/* ReactFlow Handles */}
            <Handle position={Position.Left} type="target" />
            <Handle position={Position.Right} type="source" />
            {/* Connection Handles */}
            <ConnectionHandle position="right" visible={hovered} />
            <ConnectionHandle position="left" visible={hovered} />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

interface ConnectionHandleProps {
  position: 'left' | 'right';
  visible?: boolean;
}

const ConnectionHandle: React.FC<ConnectionHandleProps> = ({ position, visible = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Line */}
      <motion.div
        initial={{
          scaleY: 0,
          opacity: 0,
        }}
        animate={{
          scaleY: visible ? 1 : 0,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        className={`
          pointer-events-none absolute top-44 -translate-y-12 z-0
          flex h-24 w-px items-center origin-center
          bg-gradient-to-b from-transparent via-white to-transparent
          ${position === 'right' ? '-right-px' : '-left-px'}
        `}
      />
      {/* Handle Button */}
      <motion.div
        initial={{
          scale: 0,
          opacity: 0,
        }}
        animate={{
          scale: visible || isHovered ? 1 : 0,
          opacity: visible || isHovered ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 20,
        }}
        className={`
          absolute top-44 -translate-y-12 z-0
          flex h-24 items-center cursor-pointer
          ${position === 'right' ? '-right-8 left-80' : '-left-8 right-80'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          whileHover={{
            scale: 1.15,
            rotate: 90,
          }}
          whileTap={{
            scale: 0.95,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 15,
          }}
          className={`p-5 rounded-full transition-colors duration-200 ${
            isHovered ? 'bg-white/5' : ''
          }`}
        >
          <Plus
            className={`h-6 w-6 transition-colors duration-200 ${
              isHovered ? 'text-white' : 'text-gray-400'
            }`}
          />
        </motion.div>
      </motion.div>
    </>
  );
};
